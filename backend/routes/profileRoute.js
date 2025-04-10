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

// Profile routes
router.route('/')
    .get(authUser, getProfile)        
    .put(authUser, updateProfile)     
    .delete(authUser, deleteAccount); 

// Address routes
router.route('/address')
    .put(authUser, updateAddress);  

// Password routes
router.route('/password')   
    .put(authUser, updatePassword);   

export default router;