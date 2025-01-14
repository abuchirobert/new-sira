import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';
import CustomError from '../errors/CustomError';
import { UserValidation, ValidationError } from '../utils/user-schema.utils';
import { generateToken } from '../utils/generate-token.util';
import { log } from 'console';

class UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }

    /**
     * Creates a new user.
     * @param {Request} req - The request object containing user data.
     * @param {Response} res - The response object to send the result.
     * @returns {Promise<void>} - A promise that resolves when the user is created.
     */

    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const validate = UserValidation.validate(req.body, 'registration');

            const user = await this.userService.createUserService(validate);
            if (!user) {
                const error = new CustomError('User not created', 500);
                throw error;
            }
            res.status(201).json({
                status: true,
                message: 'User Created Successfully and OTP sent to your email, Kindly check Your Email to activate your account...'
            });
        } catch (error: any) {
            if (error instanceof ValidationError) {
                // Handle validation errors
                res.status(400).json({
                    status: false,
                    message: 'Validation Error',
                    errors: error.errors // Return the array of validation errors
                });
            } else {
                // Handle other errors
                res.status(error.status || 500).json({
                    status: false,
                    message: error.message || 'An unexpected error occurred'
                });
            }
        }
    };

    public loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validate = UserValidation.validate(req.body, 'login');
            const { email, password } = validate;

            const user: any = await this.userService.loginUserService(email, password);
            if (!user) {
                const error = new CustomError('User not logged in', 500);
                return next(error);
            }

            const userId = user._id.toString();
            const token = generateToken(res, { _id: userId });
            log(token);
            res.status(200).json({
                status: true,
                message: 'User Logged In Successfully'
            });
        } catch (error: any) {
            if (error instanceof ValidationError) {
                // Handle validation errors
                res.status(400).json({
                    status: false,
                    message: 'Validation Error',
                    errors: error.errors // Return the array of validation errors
                });
            } else {
                // Handle other errors
                res.status(error.status || 500).json({
                    status: false,
                    message: error.message || 'An unexpected error occurred'
                });
            }
        }
    };

    /**
     * Gets all users.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object to send the result.
     * @param {NextFunction} next - The next function to call the next middleware.
     * @returns {Promise<void>} - A promise that resolves when the users are retrieved.
     */
    public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.getUsers();
            if (!users) {
                const error = new CustomError('No users found', 404);
                return next(error);
            }
            if (users.length === 0) {
                const error = new CustomError('No users found', 404);
                return next(error);
            }
            res.status(200).json({
                status: true,
                message: 'Users Found',
                data: users
            });
        } catch (error: any) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    };

    /**
     * Verifies a user.
     * @param {Request} req - The request object containing user data.
     * @param {Response} res - The response object to send the result.
     * @returns {Promise<void>} - A promise that resolves when the user is verified.
     */
    public verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                const error = new CustomError('Email and OTP are required', 400);
                return next(error);
            }

            const user = await this.userService.verifyUser(email, otp);
            if (!user) {
                const error = new CustomError('User not verified', 500);
                return next(error);
            }
            res.status(200).json({
                status: true,
                message: 'User Verified Successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    };

    public generateOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.body;
            if (!email) {
                const error = new CustomError('Email is required', 400);
                return next(error);
            }
            const user = await this.userService.generateOtp(email);
            if (!user) {
                const error = new CustomError('OTP not generated', 500);
                return next(error);
            }
            res.status(200).json({
                status: true,
                message: 'OTP Generated Successfully and sent to your email'
            });
        } catch (error: any) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    };
    public deleteUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.deleteUsers();
            if (!users) {
                const error = new CustomError('Users not deleted', 500);
                return next(error);
            }
            res.status(206).json({
                status: true,
                message: 'Users Deleted Successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    };

    public logout = async (req: Request, res: Response) => {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none', // Matching your original cookie configuration
            expires: new Date(0)
        });
        res.status(200).json({
            status: true,
            message: 'You have Successfully logged out'
        });
    };
}

export default UserController;
