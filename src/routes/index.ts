import { Router } from 'express';
import userRouter from './user.route';
import reportRouter from './report.route';
import forgetPasswordRouter from './forget-password.route';
import adminRouter from './admin/admin.route';
import notificationRouter from './notification.route';

const router = Router();

router.use('/auth', userRouter);
router.use('/report', reportRouter);
router.use('/auth/password', forgetPasswordRouter);
router.use('/admin', adminRouter);
router.use('/notifications', notificationRouter);

export default router;
