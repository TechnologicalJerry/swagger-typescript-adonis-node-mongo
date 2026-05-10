import nodemailer from 'nodemailer'
import env from '#start/env'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.get('SMTP_HOST', 'smtp.mailtrap.io'),
      port: env.get('SMTP_PORT', 2525),
      auth: {
        user: env.get('SMTP_USER', 'user'),
        pass: env.get('SMTP_PASS', 'pass'),
      },
    })
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `http://localhost:3333/api/v1/auth/reset-password?token=${token}`

    const mailOptions = {
      from: env.get('FROM_EMAIL', 'noreply@example.com'),
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please use the following token or link to reset your password: \n\nToken: ${token}\nLink: ${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: `
        <p>You requested a password reset.</p>
        <p>Please use the following token or link to reset your password:</p>
        <p><strong>Token:</strong> ${token}</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }
}
