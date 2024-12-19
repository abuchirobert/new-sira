import { NextFunction, Request, Response } from 'express';
import CustomError from './CustomError';
import { MulterError } from 'multer';

const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        return;
    }

    if (err instanceof SyntaxError) {
        res.status(400).json({
            status: false,
            message: 'Invalid JSON',
            error: err.message,
            name: err.name
        });
        return;
    }
    if (err instanceof TypeError) {
        res.status(400).json({
            status: false,
            message: 'Invalid JSON',
            error: err.message,
            name: err.name
        });
        return;
    }
    if (err instanceof MulterError) {
        res.status(400).json({
            status: false,
            message: 'Invalid File',
            error: err.message,
            name: err.name
        });
        return;
    }

    res.status(500).json({
        status: false,
        message: 'Internal Server Error'
    });
};

export default globalError;
