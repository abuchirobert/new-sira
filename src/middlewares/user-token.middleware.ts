import { Request, Response, NextFunction } from 'express';

import CustomError from '../errors/CustomError';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { log } from 'console';

declare global {
    namespace Express {
        interface Request {
            user?: any; // You can replace 'any' with your specific User type
        }
    }
}
class AuthToken {
    /*
     * Verify Token Middleware
     * This middleware is used to verify the token sent by the user
     * It checks if the token is valid and if the user exists
     * If the token is valid and the user exists, it attaches the user object to the request object
     * The user object can be accessed in the route handler
     *
     */

    verifyToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (process.env.JWT_SECRET === undefined) {
                const error = new CustomError('JWT Secret Key is not set', 500);
                return next(error);
            }
            // check for token in cookies first
            // Get token from multiple sources
            let token;
            if (req.cookies && req.cookies.token) {
                token = req.cookies.token;
            } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                const error = new CustomError('Unauthorized, No Token', 401);
                return next(error);
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
            log('decoded', decoded);
            log('User ID from token:', decoded.id);
            const user = await User.findById(decoded.id).select('-password');
            log('User found in database:', user);
            if (!user) {
                const error = new CustomError('Unauthorized, No User Found', 401);
                return next(error);
            }
            req.user = user;
            next();
        } catch (error: any) {
            // Handle different types of errors
            if (error.name === 'JsonWebTokenError') {
                res.status(401).json({
                    status: false,
                    message: 'Invalid token'
                });
                return;
            }

            if (error.name === 'TokenExpiredError') {
                res.status(401).json({
                    status: false,
                    message: 'Token expired'
                });
                return;
            }

            // Generic error handling
            res.status(500).json({
                status: false,
                message: 'Not authorized, token failed',
                error: process.env.NODE_ENV !== 'production' ? error.message : '',
                stack: process.env.NODE_ENV !== 'production' ? error.stack : ''
            });
        }
    };
}

export default AuthToken;
