const nodemailer = require('nodemailer');

/**
 * Email Service to handle sending reset codes and other notifications.
 * For production, you should use environment variables for credentials.
 */
class EmailService {
    constructor() {
        // Default transporter (can be overridden by environment variables)
        this.transporter = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        // For development/demo, we can use Ethereal (fake SMTP service)
        // In production, replace with your Gmail/Outlook/SendGrid credentials
        try {
            // Check for process.env.EMAIL_USER if you want to use real credentials later
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                this.transporter = nodemailer.createTransport({
                    service: 'gmail', // or your provider
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });
            } else {
                // Fallback to a special "Test Account" for demo if no credentials provided
                // This creates a temporary account for you to see the email!
                const testAccount = await nodemailer.createTestAccount();
                this.transporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: testAccount.user, // generated ethereal user
                        pass: testAccount.pass, // generated ethereal password
                    },
                    tls: {
                        rejectUnauthorized: false // This fixes the self-signed certificate error
                    }
                });
                console.log(`[EMAIL SERVICE] Demo mode active. Test account: ${testAccount.user}`);
            }
            this.isInitialized = true;
        } catch (error) {
            console.error('[EMAIL SERVICE] Failed to initialize email transporter:', error);
        }
    }

    async sendResetCode(email, code) {
        await this.initialize();

        if (!this.transporter) {
            console.error('[EMAIL SERVICE] Transporter not ready. Falling back to console log.');
            console.log(`[BACKUP] Reset code for ${email}: ${code}`);
            return;
        }

        const mailOptions = {
            from: '"KECS AI Guidance" <noreply@kecs-ai.edu>',
            to: email,
            subject: 'Password Reset Code - KECS AI Guidance',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                    <h2 style="color: #667eea; text-align: center;">KECS AI Guidance</h2>
                    <p>Hello,</p>
                    <p>You requested a password reset for your account. Please use the following 6-digit verification code:</p>
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827;">
                        ${code}
                    </div>
                    <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="font-size: 12px; color: #6b7280; text-align: center;">&copy; 2026 KECS AI Guidance System. All rights reserved.</p>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[EMAIL SERVICE] Reset email sent to ${email}`);

            // If using Ethereal, provide the preview URL
            if (info.messageId && nodemailer.getTestMessageUrl(info)) {
                console.log(`[EMAIL PREVIEW] Check the email here: ${nodemailer.getTestMessageUrl(info)}`);
                return nodemailer.getTestMessageUrl(info);
            }
            return true;
        } catch (error) {
            console.error(`[EMAIL SERVICE] Failed to send email to ${email}:`, error);
            throw error;
        }
    }
}

module.exports = new EmailService();
