import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";


const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log('Fetching user profile for ID:', userId);
        
        const userData = await userModel.findById(userId)
            .select('-password -__v -createdAt -updatedAt')
            .lean();

        console.log('User fetched from database:', userData);

        if (!userData) {
            console.log('User not found in database');
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Initialize profile with default values if it doesn't exist
        if (!userData.profile) {
            console.log('Profile not found, initializing default profile');
            userData.profile = {
                dateOfBirth: null,
                bloodGroup: null,
                gender: null
            };
        }

        // Ensure cartData exists
        if (!userData.cartData) {
            console.log('Initializing empty cartData');
            userData.cartData = {};
        }

        console.log('Final user object being returned:', userData);

        res.status(200).json({ 
            success: true, 
            user: userData,
            token: createToken(userData._id),
            userId: userData._id
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
            
            const usernameExists = await userModel.findOne({ 
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

        const updatedUser = await userModel.findByIdAndUpdate(
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

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, userData.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Current password is incorrect" 
            });
        }

        // Check if new password is different
        const isSamePassword = await bcrypt.compare(newPassword, userData.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                success: false, 
                message: "New password must be different from current password" 
            });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(newPassword, salt);
        await userData.save();

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

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Incorrect password" 
            });
        }

        await userModel.findByIdAndDelete(userId);
        
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
    updatePassword, 
    deleteAccount 
};