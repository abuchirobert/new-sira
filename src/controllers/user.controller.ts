import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';
import CustomError from '../errors/CustomError';

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
            const user = await this.userService.createUserService(req.body);
            if (!user) {
                const error = new CustomError('User not created', 500);
                throw error;
            }
            res.status(201).json({
                status: true,
                message: 'User Created Successfully and OTP sent to your email, Kindly check Your Email to activate your account...'
            });
        } catch (error: any) {
            res.status(500).json({
                status: false,
                message: error.message,
                statusCode: 500,
                error: error.message
            });
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
                message: error.message,
                statusCode: 500,
                error: error.message
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
                message: error.message,
                statusCode: 500,
                error: error.message
            });
        }
    };
}

export default UserController;
