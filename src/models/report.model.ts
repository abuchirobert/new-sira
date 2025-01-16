import mongoose, { model, Schema } from 'mongoose';
import { IReport } from '../interfaces/report.interface';
import { EvidenceStatus } from '../interfaces/report.interface';

const reportSchema = new Schema<IReport>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User' // Assuming you have a User model
        },
        evidence: {
            type: [String],
            default: [],
            required: true
        },
        issueType: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(EvidenceStatus),
            default: EvidenceStatus.PENDING
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Report = model<IReport>('Report', reportSchema);

export default Report;
