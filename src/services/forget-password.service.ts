// services/AuthService.ts
import User from '../models/user.model';
import { generateOTP, sendEmail } from '../utils/helpers';
import UtilFunctions from '../utils/generate-otp.utils';
export default class AuthService {
    /**
     * Initiates the password reset process
     * @param email User's email
     * @returns Status and message
     */
    static async initiatePasswordReset(email: string): Promise<{ status: boolean; message: string }> {
        try {
            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return {
                    status: false,
                    message: 'No account found with this email address'
                };
            }

            // Generate a 6-digit OTP
            const otp = UtilFunctions.generateOTP();
            const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

            // Save OTP to the user document
            user.otp = Number(otp);
            user.otpExpires = otpExpires;
            await user.save();

            // Send email with OTP
            const emailSent = await sendEmail({
                to: email,
                subject: 'Password Reset OTP',
                html: `
                    <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Forget Password OTP</title>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                </head>
                <body style="font-family: 'Poppins', sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
                    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); overflow: hidden;">
                        <div style="background-color: #0056B3; color: #ffffff; padding: 20px; text-align: center; font-size: 24px;">
                            Forget Password OTP
                        </div>
                        <div style="padding: 20px; text-align: center; color: #333333;">
                            <p style="margin: 10px 0; line-height: 1.5;">Please enter this verification code.</p>
                            <div style="font-size: 24px; font-weight: bold; color: #0056B3; margin: 20px 0;"><h1>${otp}</h1></div>
                            <p style="margin: 10px 0; line-height: 1.5;">This code is valid for the next 15 minutes.</p>
                            <div style="margin-top: 20px; font-size: 14px; color: #666666;">
                                <p><i>Sira - Spot It, Report It & Improve It.</i></p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                `
            });

            if (!emailSent) {
                return {
                    status: false,
                    message: 'Failed to send OTP email. Please try again.'
                };
            }

            return {
                status: true,
                message: 'OTP sent to your email address'
            };
        } catch (error) {
            console.error('Error initiating password reset:', error);
            return {
                status: false,
                message: 'Failed to process your request. Please try again.'
            };
        }
    }

    /**
     * Verify the OTP entered by the user
     * @param email User's email
     * @param otp The OTP entered by the user
     * @returns Status and message
     */
    static async verifyOTP(email: string, otp: number): Promise<{ status: boolean; message: string }> {
        try {
            const user = await User.findOne({
                email,
                otp,
                otpExpires: { $gt: new Date() } // OTP should not be expired
            });

            if (!user) {
                return {
                    status: false,
                    message: 'Invalid or expired OTP'
                };
            }

            return {
                status: true,
                message: 'OTP verified successfully'
            };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return {
                status: false,
                message: 'Failed to verify OTP. Please try again.'
            };
        }
    }

    /**
     * Reset the user's password after OTP verification
     * @param email User's email
     * @param otp Verified OTP
     * @param newPassword New password
     * @returns Status and message
     */
    static async resetPassword(email: string, otp: number, newPassword: string): Promise<{ status: boolean; message: string }> {
        try {
            const user = await User.findOne({
                email,
                otp,
                otpExpires: { $gt: new Date() } // Double-check OTP is still valid
            });

            if (!user) {
                return {
                    status: false,
                    message: 'Invalid or expired OTP'
                };
            }

            // Update password
            user.password = newPassword;

            // Clear OTP data
            user.otp = undefined;
            user.otpExpires = undefined;

            await user.save();

            return {
                status: true,
                message: 'Password reset successful'
            };
        } catch (error) {
            console.error('Error resetting password:', error);
            return {
                status: false,
                message: 'Failed to reset password. Please try again.'
            };
        }
    }
}
