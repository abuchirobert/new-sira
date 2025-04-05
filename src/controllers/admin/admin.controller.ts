import { NextFunction, Request, Response } from 'express';
import adminService from '../../services/admin/admin.service';
import CustomError from '../../errors/CustomError';
import { Types } from 'mongoose';
import { EvidenceStatus } from '../../interfaces/report.interface';
import { log } from 'console';

console.log('AdminService:', adminService); // 🔍 Debugging

class AdminController {
    public getAllReports = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reports = await adminService.getAllReports();
            res.status(200).json({
                status: true,
                message: 'Reports retrieved successfully',
                data: reports
            });
        } catch (error: any) {
            next(new CustomError(error.message, 500));
        }
    };

    /**
     * Update report status (admin only)
     */
    public updateReportStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { reportId } = req.params;
            const { status } = req.body;

            // Validate reportId
            if (!Types.ObjectId.isValid(reportId)) {
                return next(new CustomError('Invalid report ID', 400));
            }

            const updatedReport = await adminService.updateReportStatus(new Types.ObjectId(reportId), status as EvidenceStatus);

            res.status(200).json({
                status: true,
                message: 'Report status updated successfully',
                data: updatedReport
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * Get reports for a specific user (admin only)
     */
    public getUserReports = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;

            // Validate userId
            if (!Types.ObjectId.isValid(userId)) {
                return next(new CustomError('Invalid user ID', 400));
            }

            const reports = await adminService.getReportsByUser(new Types.ObjectId(userId));

            log(reports, 'Reports From ID');

            res.status(200).json({
                status: true,
                message: 'User reports retrieved successfully',
                data: reports
            });
        } catch (error: any) {
            res.status(500).json({
                status: false,
                message: error.message,
                stack: error.stack
            });
            // next(new CustomError(error.message, 500));
        }
    };

    public deleteReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { reportId } = req.params;
            const report = await adminService.deleteReport(new Types.ObjectId(reportId));
            if (!report) {
                return next(new CustomError('Report not found', 404));
            }
            res.status(200).json({
                status: true,
                message: 'Report deleted successfully',
                data: report
            });
        } catch (error: any) {
            next(new CustomError(error.message, 500));
        }
    };
}

export default new AdminController();
