import { model, Schema } from 'mongoose';
import IUser, { IRole } from '../interfaces/user.interface';

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },

        role: {
            type: String,
            enum: [IRole.ADMIN, IRole.USER],
            default: IRole.USER
        },
        otp: {
            type: Number
        },
        otpExpires: {
            type: Date
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const User = model<IUser>('User', userSchema);
export default User;
