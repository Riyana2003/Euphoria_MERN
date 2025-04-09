import express from 'express';
import {
    getProfile,
    updateProfile,
    updateAddress,
    updatePassword,
    deleteAccount
} from '../controllers/profileController.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(authUser);

// GET /api/profile
router.get('/', getProfile);

// PUT /api/profile
router.put('/', updateProfile);

// PUT /api/profile/address
router.put('/address', updateAddress);

// PUT /api/profile/password
router.put('/password', updatePassword);

// DELETE /api/profile
router.delete('/', deleteAccount);

export default router;