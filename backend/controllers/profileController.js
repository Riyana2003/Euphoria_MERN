import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/userModel.js';

// Helper function to create JWT token
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });
};

// Profile Management Functions
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('-password -__v -createdAt -updatedAt')
            .lean();

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Initialize profile if doesn't exist
        if (!user.profile) {
            user.profile = {
                dateOfBirth: null,
                bloodGroup: null,
                gender: null,
                addresses: []
            };
        }

        res.status(200).json({ 
            success: true, 
            user 
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
        const { dateOfBirth, bloodGroup, gender } = req.body;

        const updateData = {
            'profile.dateOfBirth': dateOfBirth,
            'profile.bloodGroup': bloodGroup,
            'profile.gender': gender
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
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
        const { type, address_details, number } = req.body;

        if (!type || !address_details || !number) {
            return res.status(400).json({ 
                success: false, 
                message: "Type, address details and number are required" 
            });
        }

        const newAddress = {
            type,
            address_details,
            number
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $push: { 'profile.addresses': newAddress } },
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
            addresses: updatedUser.profile.addresses 
        });
    } catch (error) {
        console.error("Add address error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Address number must be unique" 
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
        const { addressId } = req.params;
        const { type, address_details, number } = req.body;

        if (!type || !address_details || !number) {
            return res.status(400).json({ 
                success: false, 
                message: "Type, address details and number are required" 
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Find the address index
        const addressIndex = user.profile.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: "Address not found" 
            });
        }

        // Update the address
        user.profile.addresses[addressIndex] = {
            ...user.profile.addresses[addressIndex].toObject(),
            type,
            address_details,
            number
        };

        await user.save();

        res.status(200).json({ 
            success: true, 
            addresses: user.profile.addresses 
        });
    } catch (error) {
        console.error("Update address error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Address number must be unique" 
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
        const { addressId } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
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
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Both current and new password are required" 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: "New password must be at least 8 characters" 
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

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

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Generate new token (optional but recommended)
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
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ 
                success: false, 
                message: "Password is required" 
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Incorrect password" 
            });
        }

        await User.findByIdAndDelete(req.userId);
        
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