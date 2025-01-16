import { IReport } from '../interfaces/report.interface';
import fs from 'fs';
import path from 'path';
import { AppConfig } from '../config/global.config';
import { Types } from 'mongoose';
import Report from '../models/report.model';

class ReportService {
    /*
        - Upload the file to Cloudinary
        - Delete the local file after successful upload
        - Return the secure URL from Cloudinary
    */
    private uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
        try {
            const result = await AppConfig.cloudinary.uploader.upload(file.path, {
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
}
