import IUser from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import UtilFunctions from '../utils/generate-otp.utils';
import EmailOtpService from '../emails/otp.email';
import { log } from 'console';

class UserService {
    private emailOtpService = new EmailOtpService();
    private emailExists = async (email: string): Promise<boolean> => {
        const user = await User.findOne({ email });
        return !!user;
    };

    public createUserService = async (userData: IUser): Promise<IUser> => {
        const { name, email, password, confirmPassword } = userData;
        // if (!name || !email || !password || !confirmPassword) {
        //     throw new Error('All fields are required');
        // }
        // if (password !== confirmPassword) {
        //     throw new Error('Password does not match');
        // }

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

    public loginUserService = async (email: string, password: string): Promise<IUser> => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('It seems like the email is not registered with us, Kindly register to continue');
        }

        if (!user.status) {
            throw new Error('User not verified, Kindly verify your email to continue');
        }
        const passwordCheck = bcrypt.compareSync(password, user.password);

        if (!passwordCheck) {
            throw new Error('The Email or Password is incorrect, Please Try again...');
        }

        return user;
    };

    public generateOtp = async (email: string): Promise<IUser> => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const otp = UtilFunctions.generateOTP();
        const otpExpires = UtilFunctions.generateOTPExpiry();
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        this.emailOtpService.sendOtpEmail(email, otp);
        log('OTP sent to email', otp);
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
            throw new Error('OTP Expired, Kindly request for a new OTP');
        }

        user.status = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return user;
    };

    public getUsers = async (): Promise<IUser[]> => {
        const users = await User.find().select('-password');
        return users;
    };

    public deleteUsers = async () => {
        const users = await User.deleteMany();
        return users;
    };
}

export default UserService;
