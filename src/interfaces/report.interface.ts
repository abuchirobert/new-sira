import { Document, Types } from 'mongoose';

export enum EvidenceStatus {
    PENDING = 'pending',
    RESOLVED = 'resolved'
}

interface IReport extends Document {
    userId: Types.ObjectId;
    evidence: string;
    issueType: string;
    location: string;
    description: string;
    status: EvidenceStatus;
}
