// controllers/AuthController.ts
import { Request, Response } from 'express';
import AuthService from '../services/forget-password.service';
import { body, validationResult } from 'express-validator';

export default class AuthController {
    /**
     * Validation rules for initiating password reset
     */
    static initiatePasswordResetValidation = [body('email').isEmail().withMessage('Please provide a valid email address')];

    /**
     * Initiate password reset process
     * @param req Request
     * @param res Response
     */
    static async initiatePasswordReset(req: Request, res: Response) {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email } = req.body;
        const result = await AuthService.initiatePasswordReset(email);

        if (!result.status) {
            res.status(400).json({ message: result.message });
            return;
        }

        res.status(200).json({ message: result.message });
    }

    /**
     * Validation rules for verifying OTP
     */
    static verifyOTPValidation = [body('email').isEmail().withMessage('Please provide a valid email address'), body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')];

    /**
     * Verify OTP
     * @param req Request
     * @param res Response
     */
    static async verifyOTP(req: Request, res: Response) {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, otp } = req.body;
        const result = await AuthService.verifyOTP(email, otp);

        if (!result.status) {
            res.status(400).json({ message: result.message });
            return;
        }

        res.status(200).json({ message: result.message });
    }

    /**
     * Validation rules for resetting password
     */
    static resetPasswordValidation = [
        body('email').isEmail().withMessage('Please provide a valid email address'),
        body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
        body('newPassword')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
    ];

    /**
     * Reset password
     * @param req Request
     * @param res Response
     */
    static async resetPassword(req: Request, res: Response) {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, otp, newPassword } = req.body;
        const result = await AuthService.resetPassword(email, otp, newPassword);

        if (!result.status) {
            res.status(400).json({ message: result.message });
            return;
        }

        res.status(200).json({ message: result.message });
    }
}
