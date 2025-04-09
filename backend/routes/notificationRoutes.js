import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  sendNotification,
  getUnreadCount
} from '../controllers/notificationController.js';
import authUser from '../middleware/auth.js'
import adminAuth from "../middleware/adminAuth.js";

const notificationRouter = express.Router();

// User routes
notificationRouter.get('/user/:userId', authUser, getUserNotifications);
notificationRouter.patch('/mark-read/:notificationId', authUser, markNotificationAsRead);
notificationRouter.get('/unread-count/:userId', authUser, getUnreadCount);

// Admin routes
notificationRouter.post('/send', adminAuth, sendNotification);

export default notificationRouter;