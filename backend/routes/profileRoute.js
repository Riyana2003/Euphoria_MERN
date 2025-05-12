import express from 'express';
import {
    updateProfile,
    updatePassword,
    deleteAccount
} from '../controllers/profileController.js';
import authUser from '../middleware/auth.js';

const profileRouter = express.Router();

// Apply auth middleware to all routes
profileRouter.use(authUser);

profileRouter.put('/', updateProfile);
profileRouter.put('/password', updatePassword);
profileRouter.delete('/', deleteAccount); 

export default profileRouter;