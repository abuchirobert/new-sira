import { Router } from 'express';
import adminController from '../../controllers/admin/admin.controller';
import AdminMiddleware from '../../middlewares/admin-access.middleware';
import AuthToken from '../../middlewares/user-token.middleware';

const adminMiddleWare = new AdminMiddleware();
const authToken = new AuthToken();

const router = Router();

// Get all reports (admin only)
router.route('/reports').get(authToken.verifyToken, adminMiddleWare.checkAdmin, adminController.getAllReports);

// Update report status (admin only)
router.route('/:reportId/status').patch(authToken.verifyToken, adminMiddleWare.checkAdmin, adminController.updateReportStatus);

// Get reports for a specific user (admin only)
router.route('/:userId/reports').get(authToken.verifyToken, adminMiddleWare.checkAdmin, adminController.getUserReports);

// delete reports for a specific user (admin only)
router.route('/:reportId/reports').delete(authToken.verifyToken, adminMiddleWare.checkAdmin, adminController.deleteReport);

export default router;
