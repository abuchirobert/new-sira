import { IReport } from '../interfaces/report.interface';
import fs from 'fs';
import { Types } from 'mongoose';
import Report from '../models/report.model';
import cloudinary from '../config/cloudinary.config';
import { log } from 'console';

class ReportService {
    /*
        - Upload the file to Cloudinary
        - Delete the local file after successful upload
        - Return the secure URL from Cloudinary
    */
    private uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'reports',
                resource_type: 'auto'
            });

            fs.unlinkSync(file.path);

            return result.secure_url;
        } catch (error) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    };

    public createReport = async (files: Express.Multer.File | undefined, data: Partial<IReport>, userId: string): Promise<IReport> => {
        if (!files) throw new Error('No File(s) provided, Kindly Provide them to Continue');

        const fileArray = Array.isArray(files) ? files : [files];

        if (fileArray.length === 0) throw new Error('No File(s) provided, Kindly Provide them to Continue');

        try {
            const uploadedPromises = fileArray.map((file) => this.uploadToCloudinary(file));
            const fileUrls = await Promise.all(uploadedPromises);
            log(userId, 'Coming from Service on creation');
            const result = {
                userId: new Types.ObjectId(userId),
                evidence: fileUrls,
                issueType: data.issueType || '',
                location: data.location || '',
                description: data.description || '',
                ...data
            };

            const report = await Report.create(result);

            return report;
        } catch (error) {
            fileArray.forEach((file) => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
            throw error;
        }
    };

    // public updateReport = async (reportId: string, files:Express.Multer.File[] | Express.Multer.File | undefined, data: Partial<IReport>): Promise<IReport> => {

    //     const
    // }

    public getReport = async (userId: string): Promise<IReport[]> => {
        if (!Types.ObjectId.isValid(userId)) throw new Error('Invalid User ID Provided');
        const id = new Types.ObjectId(userId);
        const report = await Report.find({ userId: id });
        return report;
    };

    public updateReport = async (reportId: string, files: Express.Multer.File[] | Express.Multer.File | undefined, data: Partial<IReport>, userId: string): Promise<IReport> => {
        if (!Types.ObjectId.isValid(reportId)) throw new Error('Invalid Report ID Provided');

        // Verify the report exists and belongs to the user
        const report = await Report.findOne({
            _id: new Types.ObjectId(reportId),
            userId: new Types.ObjectId(userId)
        });

        if (!report) throw new Error('Report not found or you do not have permission to update it');

        // Handle file uploads if provided
        let fileUrls: string[] = [];
        if (files) {
            const fileArray = Array.isArray(files) ? files : [files];
            if (fileArray.length > 0) {
                try {
                    const uploadedPromises = fileArray.map((file) => this.uploadToCloudinary(file));
                    fileUrls = await Promise.all(uploadedPromises);
                } catch (error) {
                    fileArray.forEach((file) => {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    });
                    throw error;
                }
            }
        }

        // Combine existing and new evidence files if any
        const updatedData: Partial<IReport> = {
            ...data
        };

        // Only update evidence if new files were uploaded
        if (fileUrls.length > 0) {
            updatedData.evidence = [...report.evidence, ...fileUrls];
        }

        // Update the report
        const updatedReport = await Report.findByIdAndUpdate(reportId, { $set: updatedData }, { new: true });

        if (!updatedReport) throw new Error('Failed to update the report');

        return updatedReport;
    };

    public deleteReport = async (reportId: string, userId: string): Promise<{ success: boolean; message: string }> => {
        if (!Types.ObjectId.isValid(reportId)) throw new Error('Invalid Report ID Provided');

        // Find the report to get evidence URLs before deletion
        const report = await Report.findOne({
            _id: new Types.ObjectId(reportId),
            userId: new Types.ObjectId(userId)
        });

        if (!report) throw new Error('Report not found or you do not have permission to delete it');

        // Delete the report from database
        const deleted = await Report.deleteOne({ _id: new Types.ObjectId(reportId) });

        if (deleted.deletedCount === 0) throw new Error('Failed to delete the report');

        // Optional: Delete associated files from Cloudinary
        // try {
        //     // This would require extracting public_id from URLs or storing them separately
        //     // For simplicity, we're skipping actual Cloudinary deletion here
        //     // You may want to implement this based on your Cloudinary configuration
        // } catch (error) {
        //     console.error('Error deleting files from Cloudinary:', error);
        //     // We still return success as the database record was deleted
        // }

        return { success: true, message: 'Report deleted successfully' };
    };
}

export default ReportService;
