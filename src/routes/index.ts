import { Router } from 'express';
import userRouter from './user.route';
import reportRouter from './report.route';
import forgetPasswordRouter from './forget-password.route';
import adminRouter from './admin/admin.route';

const router = Router();

router.use('/auth', userRouter);
router.use('/report', reportRouter);
router.use('/auth/password', forgetPasswordRouter);
router.use('/admin', adminRouter);

export default router;
