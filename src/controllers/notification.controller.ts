import { Notification } from '../models/notification.model';
import { Request, Response } from 'express';

export const getUserNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ notifications });
        console.log(notifications)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

export const markNotificationsRead = async (req: Request, res: Response) => {
    try {
        await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } });
        res.json({ message: 'Notifications marked as read' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
};

export const createNotification = async (userId: string, message: string) => {
    try {
        await Notification.create({ user: userId, message });
    } catch (err) {
        // Optionally log error
    }
};
