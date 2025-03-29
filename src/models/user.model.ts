import { model, Schema } from 'mongoose';
import IUser, { IRole } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';

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

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    const user = this as IUser;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};
const User = model<IUser>('User', userSchema);
export default User;
