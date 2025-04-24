import express from 'express';
import {
    getProfile,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    updatePassword,
    deleteAccount
} from '../controllers/profileController.js';
import authUser from '../middleware/auth.js'

const router = express.Router();

router.use(authUser);

// GET /api/profile - Get user profile
router.get('/', getProfile);

// PUT /api/profile - Update profile
router.put('/', updateProfile);

// POST /api/profile/address - Add new address
router.post('/address', addAddress);

// PUT /api/profile/address/:addressId - Update address
router.put('/address/:addressId', updateAddress);

// DELETE /api/profile/address/:addressId - Delete address
router.delete('/address/:addressId', deleteAddress);

// PUT /api/profile/password - Update password
router.put('/password', updatePassword);

// DELETE /api/profile - Delete account
router.delete('/', deleteAccount);

export default router;