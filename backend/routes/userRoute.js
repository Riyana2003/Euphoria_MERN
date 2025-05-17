import express from 'express';
import { 
    loginUser,
    registerUser,
    adminLogin,
    sendLoginOtp,
    sendRegistrationOtp 
} from '../controllers/userController.js';

const userRouter = express.Router();

// OTP endpoints
userRouter.post('/send-login-otp', sendLoginOtp);
userRouter.post('/send-registration-otp', sendRegistrationOtp);

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

export default userRouter;