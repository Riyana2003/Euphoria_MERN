import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/userModel.js';

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -__v -createdAt -updatedAt')
            .lean();

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Initialize profile with default values if it doesn't exist
        if (!user.profile) {
            user.profile = {
                dateOfBirth: null,
                bloodGroup: null,
                gender: null,
                addresses: []
            };
        }

        // Ensure cartData exists
        if (!user.cartData) {
            user.cartData = {};
        }

        res.status(200).json({ 
            success: true, 
            user,
            token: createToken(user._id),
            userId: user._id
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch profile" 
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, dateOfBirth, bloodGroup, gender } = req.body;
        const userId = req.user._id;

        // Validate username if provided
        if (username) {
            if (username.length < 3 || username.length > 30) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Username must be between 3 and 30 characters" 
                });
            }
            
            const usernameExists = await User.findOne({ 
                username: username.toLowerCase(), 
                _id: { $ne: userId } 
            });
            
            if (usernameExists) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Username already in use" 
                });
            }
        }

        // Validate bloodGroup against enum values
        if (bloodGroup && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bloodGroup)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid blood group" 
            });
        }

        // Validate gender against enum values
        if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid gender" 
            });
        }

        // Prepare update data
        const updateData = {
            ...(username && { username: username.toLowerCase() }),
            profile: {
                ...(dateOfBirth && { dateOfBirth }),
                ...(bloodGroup && { bloodGroup }),
                ...(gender && { gender })
            }
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password -__v -createdAt -updatedAt');

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            user: updatedUser 
        });
    } catch (error) {
        console.error("Update profile error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: "Profile update failed" 
        });
    }
};

const addAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, address_details, number } = req.body;

        // Validate required fields
        if (!type || !address_details || !number) {
            return res.status(400).json({ 
                success: false, 
                message: "Type, address details and number are required" 
            });
        }

        // Validate address type against enum values
        if (!['Home', 'Work', 'Other'].includes(type)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid address type. Must be Home, Work, or Other" 
            });
        }

        // Check for unique address number
        const user = await User.findOne({
            _id: userId,
            'profile.addresses.number': number
        });

        if (user) {
            return res.status(400).json({ 
                success: false, 
                message: "Address number must be unique" 
            });
        }

        const newAddress = {
            type,
            address_details,
            number
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { 'profile.addresses': newAddress } },
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password -__v -createdAt -updatedAt');

        res.status(200).json({ 
            success: true, 
            addresses: updatedUser.profile.addresses 
        });
    } catch (error) {
        console.error("Add address error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: "Failed to add address" 
        });
    }
};

const updateAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.params;
        const { type, address_details, number } = req.body;

        // Validate required fields
        if (!type || !address_details || !number) {
            return res.status(400).json({ 
                success: false, 
                message: "Type, address details and number are required" 
            });
        }

        // Validate address type against enum values
        if (!['Home', 'Work', 'Other'].includes(type)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid address type. Must be Home, Work, or Other" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Find the address
        const address = user.profile.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ 
                success: false, 
                message: "Address not found" 
            });
        }

        // Check if number is being changed to an existing one
        if (number !== address.number) {
            const numberExists = user.profile.addresses.some(
                addr => addr.number === number && addr._id.toString() !== addressId
            );
            if (numberExists) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Address number must be unique" 
                });
            }
        }

        // Update address
        address.type = type;
        address.address_details = address_details;
        address.number = number;

        await user.save();

        res.status(200).json({ 
            success: true, 
            addresses: user.profile.addresses 
        });
    } catch (error) {
        console.error("Update address error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: "Failed to update address" 
        });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { 'profile.addresses': { _id: addressId } } },
            { 
                new: true 
            }
        ).select('-password -__v -createdAt -updatedAt');

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            addresses: updatedUser.profile.addresses 
        });
    } catch (error) {
        console.error("Delete address error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to delete address" 
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Both current and new password are required" 
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: "New password must be at least 8 characters" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Current password is incorrect" 
            });
        }

        // Check if new password is different
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                success: false, 
                message: "New password must be different from current password" 
            });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Generate new token
        const token = createToken(user._id);

        res.status(200).json({ 
            success: true, 
            message: "Password updated successfully",
            token 
        });
    } catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update password" 
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ 
                success: false, 
                message: "Password is required" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Incorrect password" 
            });
        }

        await User.findByIdAndDelete(userId);
        
        res.status(200).json({ 
            success: true, 
            message: "Account deleted successfully" 
        });
    } catch (error) {
        console.error("Delete account error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to delete account" 
        });
    }
};

export { 
    getProfile, 
    updateProfile, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    updatePassword, 
    deleteAccount 
};