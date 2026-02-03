import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  private getHtmlTemplate(title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #4A90E2; color: #ffffff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .code-box { background-color: #f8f9fa; border: 2px dashed #4A90E2; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4A90E2; }
          .footer { background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888; }
          .expiry { font-size: 14px; color: #666; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Trackly. All rights reserved.</p>
            <p>If you didn't request this email, please ignore it.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendPasswordResetCode(to: string, code: string) {
    const subject = 'Reset Your Password';
    const html = this.getHtmlTemplate(
      subject,
      `
      <p>Hello,</p>
      <p>You requested to reset your password. Please use the following code to proceed:</p>
      <div class="code-box">
        <div class="code">${code}</div>
      </div>
      <p class="expiry">This code will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
    );

    await this.mailer.sendMail({
      to,
      subject,
      text: `Your password reset code is: ${code}. It expires in 10 minutes.`,
      html,
    });
  }

  async sendEmailVerificationCode(to: string, code: string) {
    const subject = 'Verify Your Email';
    const html = this.getHtmlTemplate(
      subject,
      `
      <p>Welcome to Trackly!</p>
      <p>Please verify your email address by entering the code below:</p>
      <div class="code-box">
        <div class="code">${code}</div>
      </div>
      <p class="expiry">This code will expire in 10 minutes.</p>
    `,
    );

    await this.mailer.sendMail({
      to,
      subject,
      text: `Your verification code is: ${code}. It expires in 10 minutes.`,
      html,
    });
  }
}
