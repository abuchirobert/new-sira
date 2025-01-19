import { NextFunction, Request, Response } from 'express';
import ReportService from '../services/report.service';

class ReportController {
    private reportService: ReportService;
    constructor(reportService: ReportService) {
        this.reportService = reportService;
    }

    public createReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const files: any = req.file || req.files;
            const reportData = req.body;
            const userId = req.user;

            const report = await this.reportService.createReport(files, reportData, userId);

            res.status(200).json({
                success: true,
                message: `Report created successfully...`,
                data: report
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'failed to create report'
            });
        }
    };
}

export default ReportController;
