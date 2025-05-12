import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

const updateProfile = async (req, res) => {
    try {
        const { username, dateOfBirth, bloodGroup, gender } = req.body;
        const userId = req.body.userId;

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

        // Validate dateOfBirth format
        if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format for date of birth"
            });
        }

        // Validate bloodGroup against enum values
        const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        if (bloodGroup && !validBloodGroups.includes(bloodGroup)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid blood group" 
            });
        }

        // Validate gender against enum values
        const validGenders = ['Male', 'Female', 'Other'];
        if (gender && !validGenders.includes(gender)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid gender" 
            });
        }

        // Prepare update data
        const updateData = {
            ...(username && { username: username.toLowerCase() }),
            profile: {
                ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }), // Ensure proper Date object
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
        ).select('-_id -__v -createdAt -updatedAt');

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
        const userId = req.body.userId;  
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Both current and new password are required" 
            });
        }

        const user = await userModel.findById(userId);
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

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Password updated successfully"
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
        const userId = req.body.userId;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ 
                success: false, 
                message: "Password is required" 
            });
        }

        const user = await userModel.findById(userId);
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
    updateProfile, 
    updatePassword, 
    deleteAccount 
};