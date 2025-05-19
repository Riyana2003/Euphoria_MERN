import express from 'express';
import {
    updateProfile,
    updatePassword,
    getProfile,
    deleteAccount
} from '../controllers/profileController.js';
import authUser from '../middleware/auth.js';

const profileRouter = express.Router();



profileRouter.get('/get', authUser, getProfile);
profileRouter.post('/update', authUser, updateProfile);
profileRouter.put('/password',authUser, updatePassword);
profileRouter.delete('/', authUser, deleteAccount); 

export default profileRouter;