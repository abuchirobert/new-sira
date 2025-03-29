import { NextFunction, Request, Response } from 'express';
import adminService from '../../services/admin/admin.service';
import CustomError from '../../errors/CustomError';
import { Types } from 'mongoose';
import { EvidenceStatus } from '../../interfaces/report.interface';

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

            res.status(200).json({
                status: true,
                message: 'User reports retrieved successfully',
                data: reports
            });
        } catch (error: any) {
            next(new CustomError(error.message, 500));
        }
    };
}

export default new AdminController();
