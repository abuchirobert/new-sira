// routes/auth.ts
import express from 'express';
import AuthController from '../controllers/forget-password.controller';

const router = express.Router();

// Password reset routes
router.route('/forgot-password').post(AuthController.initiatePasswordResetValidation, AuthController.initiatePasswordReset);

router.route('/verify-otp').post(AuthController.verifyOTPValidation, AuthController.verifyOTP);

router.route('/reset-password').post(AuthController.resetPasswordValidation, AuthController.resetPassword);

export default router;
