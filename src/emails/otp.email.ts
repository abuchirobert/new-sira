import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

configDotenv();

class EmailOtpService {
    private async createEmailTransport() {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    async sendOtpEmail(email: string, otp: number) {
        const transporter = await this.createEmailTransport();
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'OTP for Email Verification',
            html: `<h1>Your OTP is ${otp}.  It expires in 15 minutes.</h1>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

export default EmailOtpService;
