// utils/helpers.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Generate a numeric OTP of specified length
 * @param length Length of the OTP
 * @returns Generated OTP
 */
export const generateOTP = (length: number): number => {
    let otp;
    for (let i = 0; i < length; i++) {
        otp! += Math.floor(Math.random() * 10);
    }
    return otp!;
};

/**
 * Send email using nodemailer
 * @param options Email options (to, subject, html)
 * @returns Boolean indicating success or failure
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: options.to,
            subject: options.subject,
            html: options.html
        });

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
