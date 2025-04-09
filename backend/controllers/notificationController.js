import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

// Get notifications for a specific user
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notifications = await Notification.find({
      $or: [
        { userId },
        { userId: { $exists: false } } // Also get broadcast notifications
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

// Send notification to users
export const sendNotification = async (req, res) => {
  try {
    const { title, message, type, target } = req.body;
    
    if (target === 'all') {
      // Send to all active users
      const activeUsers = await User.find({ isActive: true }).select('_id');
      
      // Create notifications in bulk
      const notifications = activeUsers.map(user => ({
        title,
        message,
        type,
        userId: user._id
      }));

      await Notification.insertMany(notifications);

      res.status(200).json({
        success: true,
        message: `Notification sent to ${activeUsers.length} users`
      });
    } else if (target === 'specific') {
      // For specific users (you can extend this)
      // You might receive an array of user IDs in the request
      const { userIds } = req.body;
      
      const notifications = userIds.map(userId => ({
        title,
        message,
        type,
        userId
      }));

      await Notification.insertMany(notifications);

      res.status(200).json({
        success: true,
        message: `Notification sent to ${userIds.length} users`
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid target specified'
      });
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications'
    });
  }
};

// Get unread notification count for a user
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await Notification.countDocuments({
      userId,
      read: false
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};