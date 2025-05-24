import { Router } from 'express';
import ReportController from '../controllers/report.controller';
import ReportService from '../services/report.service';
import imageUploadMiddleware from '../middlewares/image-upload.middleware';
import AuthToken from '../middlewares/user-token.middleware';

const router = Router();

const reportService = new ReportService();
const authToken = new AuthToken();

const reportController = new ReportController(reportService);

router.post('/user', authToken.verifyToken, imageUploadMiddleware.uploadMultiple, reportController.createReport); //create post route
router.put('/update/:id', authToken.verifyToken, imageUploadMiddleware.uploadMultiple, reportController.updateReport);
router.delete('/delete/:id', authToken.verifyToken, reportController.deleteReport);
router.get('/get-my-report', authToken.verifyToken, reportController.getReports);
router.get('/get-my-report/:reportId', authToken.verifyToken, reportController.getReport);

export default router;
