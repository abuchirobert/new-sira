import { Router } from 'express';
import adminController from '../../controllers/admin/admin.controller';
import AdminMiddleware from '../../middlewares/admin-access.middleware';

const adminMiddleWare = new AdminMiddleware();

const router = Router();

// Get all reports (admin only)
router.route('/reports').get(adminMiddleWare.checkAdmin, adminController.getAllReports);

// Update report status (admin only)
router.route('/:reportId/status').patch(adminMiddleWare.checkAdmin, adminController.updateReportStatus);

// Get reports for a specific user (admin only)
router.route('/:userId/reports').get(adminMiddleWare.checkAdmin, adminController.getUserReports);

export default router;
