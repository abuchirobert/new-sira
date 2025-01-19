import { Document, Types } from 'mongoose';

export enum EvidenceStatus {
    PENDING = 'pending',
    RESOLVED = 'resolved'
}

export interface IReport extends Document {
    userId: Types.ObjectId;
    evidence: Array<string>;
    issueType: string;
    location: string;
    description: string;
    status: EvidenceStatus;
}
