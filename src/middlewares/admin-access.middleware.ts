import { NextFunction, Request, Response } from 'express';
import CustomError from '../errors/CustomError';

class AdminMiddleWare {
    checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Ensure the user exists
            if (!req.user) {
                const error = new CustomError('Unauthorized, No User Found', 401);
                return next(error);
            }
            const user = req.user;
            if (user.role !== ('admin' as string)) {
                const error = new CustomError('Unauthorized, Admin access only', 401);
                return next(error);
            }
            next();
        } catch (error: any) {
            res.status(error.status | 500).json({
                status: false,
                message: error.message
            });
        }
    };
}

export default AdminMiddleWare;
