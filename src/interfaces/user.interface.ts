import { Document } from 'mongoose';

export enum IRole {
    ADMIN = 'admin',
    USER = 'user'
}

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role: IRole;
    otp?: number;
    otpExpires?: Date;
    status: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserInputDTO {
    createUser(userData: IUser): Promise<IUser>;
}

export default IUser;
