import IUser from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import UtilFunctions from '../utils/generate-otp.utils';
import EmailOtpService from '../emails/otp.email';

class UserService {
    private emailOtpService = new EmailOtpService();
    private emailExists = async (email: string): Promise<boolean> => {
        const user = await User.findOne({ email });
        return !!user;
    };

    public createUserService = async (userData: IUser): Promise<IUser> => {
        const { name, email, password, confirmPassword } = userData;
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('All fields are required');
        }
        if (password !== confirmPassword) {
            throw new Error('Password does not match');
        }

        const emailExists = await this.emailExists(email);
        if (emailExists) {
            throw new Error('Email already exists');
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        const otp = UtilFunctions.generateOTP();
        const otpExpires = UtilFunctions.generateOTPExpiry();
        const user = await User.create({ name, email, password: passwordHash, otp, otpExpires });

        this.emailOtpService.sendOtpEmail(email, otp);
        return user;
    };

    public verifyUser = async (email: string, otp: number): Promise<IUser> => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        if (user.status) {
            throw new Error('User already verified');
        }

        if (!user.otpExpires || new Date() > user?.otpExpires) {
            throw new Error('OTP Expired');
        }

        user.status = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return user;
    };

    public getUsers = async (): Promise<IUser[]> => {
        const users = await User.find();
        return users;
    };

    public deleteUsers = async () => {
        const users = await User.deleteMany();
        return users;
    };
}

export default UserService;
