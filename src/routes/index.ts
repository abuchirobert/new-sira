import { Router } from 'express';
import userRouter from './user.route';
import reportRouter from './report.route';
const router = Router();

router.use('/auth', userRouter);
router.use('/report', reportRouter);
export default router;
