import express from 'express';
import {
    getProfile,
    updateProfile,
    updatePassword,
    deleteAccount
} from '../controllers/profileController.js';
import authUser from '../middleware/auth.js'

const router = express.Router();

router.use(authUser);

// GET /api/profile - Get user profile
router.get('/',authUser, getProfile);

// PUT /api/profile - Update profile
router.put('/',authUser, updateProfile);

// PUT /api/profile/password - Update password
router.put('/password', authUser, updatePassword);

// DELETE /api/profile - Delete account
router.delete('/',authUser, deleteAccount);

export default router;