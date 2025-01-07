import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
import { get } from 'http';
import { string } from 'joi';

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
    

    private getOtpEmailTemplate(otp: number): string {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Poppins', sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background-color: #87ceeb; color: #ffffff; padding: 20px; text-align: center; font-size: 24px;">
            Hey Dude! You are Almost There!
        </div>
        <div style="padding: 20px; text-align: center; color: #333333;">
            <p style="margin: 10px 0; line-height: 1.5;">Please enter this verification code in the window where you started creating your account.</p>
            <div style="font-size: 24px; font-weight: bold; color: #87ceeb; margin: 20px 0;"><h1>${otp}</h1></div>
            <p style="margin: 10px 0; line-height: 1.5;">This code is valid for the next 15 minutes.</p>
            <div style="margin-top: 20px; font-size: 14px; color: #666666;">
                <p><i>Sira - Spot It, Report It & Improve It.</i></p>
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    private getFromEmail(): string{ 
        return `"Abuchi From Sira" <${process.env.SMTP_USER}>`;
    }


    async sendOtpEmail(email: string, otp: number) {
        const transporter = await this.createEmailTransport();
        const mailOptions = {
            from: this.getFromEmail(),
            to: email,
            subject: 'Your OTP is Here',
            html: this.getOtpEmailTemplate(otp)
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
