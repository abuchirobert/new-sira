import { Router } from 'express';
import ReportController from '../controllers/report.controller';
import ReportService from '../services/report.service';
import imageUploadMiddleware from '../middlewares/image-upload.middleware';
import AuthToken from '../middlewares/user-token.middleware';

const router = Router();

const reportService = new ReportService();
const authToken = new AuthToken();

const reportController = new ReportController(reportService);

router.route('/user').post(imageUploadMiddleware.uploadMultiple, reportController.createReport);
router.route('/update/:id').put(authToken.verifyToken, imageUploadMiddleware.uploadMultiple, reportController.updateReport);
router.route('/delete/:id').delete(authToken.verifyToken, reportController.deleteReport);
router.route('/get/:id').get(authToken.verifyToken, reportController.getReport);

export default router;
