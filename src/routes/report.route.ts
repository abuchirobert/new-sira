import { Router } from 'express';
import ReportController from '../controllers/report.controller';
import ReportService from '../services/report.service';
import imageUploadMiddleware from '../middlewares/image-upload.middleware';

const router = Router();

const reportService = new ReportService();

const reportController = new ReportController(reportService);

router.route('/user').post(imageUploadMiddleware.uploadMultiple, reportController.createReport);

export default router;
