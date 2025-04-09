import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('-password')
            .lean();

        if (!user.profile) {
            user.profile = {};
            await User.findByIdAndUpdate(req.userId, { profile: {} });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { 
                $set: { 
                    'profile.fullName': req.body.fullName,
                    'profile.dateOfBirth': req.body.dateOfBirth,
                    'profile.bloodGroup': req.body.bloodGroup,
                    'profile.gender': req.body.gender
                } 
            },
            { new: true }
        ).select('-password');

        res.json({ 
            success: true, 
            user: updatedUser 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: "Update failed" 
        });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: { 'profile.addresses': req.body.addresses } },
            { new: true }
        ).select('-password');

        res.json({ 
            success: true, 
            addresses: updatedUser.profile.addresses 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: "Address update failed" 
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Current password is incorrect" 
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.newPassword, salt);
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ 
            success: true, 
            message: "Password updated",
            token 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Password change failed" 
        });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Password is incorrect" 
            });
        }

        await User.findByIdAndDelete(req.userId);
        res.json({ 
            success: true, 
            message: "Account deleted" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Account deletion failed" 
        });
    }
};