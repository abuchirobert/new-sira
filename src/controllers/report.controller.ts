import { NextFunction, Request, Response } from 'express';
import ReportService from '../services/report.service';
import { log } from 'console';

class ReportController {
    private reportService: ReportService;
    constructor(reportService: ReportService) {
        this.reportService = reportService;
    }

    public createReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const files: any = req.file || req.files;
            const reportData = req.body;
            const userId = req.user._id;
            log(userId, 'Coming from Controller create Report');

            const report = await this.reportService.createReport(files, reportData, userId);

            res.status(200).json({
                success: true,
                message: `Report created successfully...`,
                data: report
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'failed to create report',
                stack: error.stack
            });
        }
    };

    public updateReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const reportId = req.params.id;
            const files: any = req.file || req.files;
            const reportData = req.body;
            const userId = req.user;

            const updatedReport = await this.reportService.updateReport(reportId, files, reportData, userId);

            res.status(200).json({
                success: true,
                message: 'Report updated successfully',
                data: updatedReport
            });
        } catch (error) {
            res.status(error instanceof Error && error.message.includes('permission') ? 403 : 500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update report'
            });
        }
    };

    public deleteReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const reportId = req.params.id;
            const userId = req.user;

            const result = await this.reportService.deleteReport(reportId, userId);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(error instanceof Error && error.message.includes('permission') ? 403 : 500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to delete report'
            });
        }
    };

    public getReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const reportId = req.user._id;
            log(reportId, 'Coming from Controller');
            const report = await this.reportService.getReport(reportId);

            if (report.length === 0) {
                res.status(404).json({
                    success: false,
                    message: `You've not Created a Report Yet, Kindly Create a Report to Continue....`
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: report
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch report'
            });
        }
    };
}

export default ReportController;
