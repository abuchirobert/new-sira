import { Types } from 'mongoose';
import CustomError from '../../errors/CustomError';
import { EvidenceStatus } from '../../interfaces/report.interface';
import Report from '../../models/report.model';
import { log } from 'console';

class AdminService {
    /**
     * Get all reports (for admin use)
     * @returns Array of reports with user details
     */
    async getAllReports() {
        try {
            const reports = await Report.find({}).populate('userId', 'name email');
            return reports;
        } catch (error: any) {
            throw new Error(`Failed to retrieve reports: ${error.message}`);
        }
    }

    /**
     * Update report status (for admin use)
     * @param reportId MongoDB Report ID
     * @param newStatus New status of the report
     * @returns Updated report
     */
    async updateReportStatus(reportId: Types.ObjectId, newStatus: EvidenceStatus) {
        try {
            // Validate status
            if (!Object.values(EvidenceStatus).includes(newStatus)) {
                throw new CustomError('Invalid report status', 400);
            }

            const report = await Report.findByIdAndUpdate(reportId, { status: newStatus }, { new: true }).populate('userId', 'name email');

            if (!report) {
                throw new CustomError('Report not found', 404);
            }

            return report;
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Get reports by user ID (for admin use)
     * @param userId MongoDB User ID
     * @returns Array of reports for specific user
     */
    async getReportsByUser(id: Types.ObjectId) {
        try {
            const reports = await Report.find({ _id: id }).populate('_id', 'name email');
            log(reports, 'Reports From ID');
            console.log(`Found ${reports.length} reports`);
            return reports;
        } catch (error: any) {
            throw new Error(`Failed to retrieve user reports: ${error.message}`);
        }
    }

    async deleteReport(reportId: Types.ObjectId) {
        try {
            const report = await Report.findByIdAndDelete(reportId);
            return report;
        } catch (error: any) {
            throw new Error(`Failed to delete report: ${error.message}`);
        }
    }
}

export default new AdminService();
