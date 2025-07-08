import { Router } from 'express';
import { getUserNotifications, markNotificationsRead } from '../controllers/notification.controller';
import { userTokenMiddleware } from '../middlewares/user-token.middleware';

const router = Router();

// Get notifications for a user
router.get('/', userTokenMiddleware, getUserNotifications);

// Mark notifications as read
router.patch('/read', userTokenMiddleware, markNotificationsRead);

export default router;


