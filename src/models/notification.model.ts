import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
    user: Schema.Types.ObjectId;
    message: string;
    read: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const Notification = model<INotification>('Notification', notificationSchema);
