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
            const reportId = req.params.id;
            const report = await this.reportService.getReport(reportId);

            if (!report) {
                res.status(404).json({
                    success: false,
                    message: 'Report not found'
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
