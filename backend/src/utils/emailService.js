import nodemailer from 'nodemailer'
import { logger } from './logger.js'

// Create reusable transporter
const createTransporter = () => {
  // For development, use Gmail or other SMTP service
  // For production, use a proper email service like SendGrid, AWS SES, etc.
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  return transporter
}

// Send verification email
export const sendVerificationEmail = async (email, username, verificationToken) => {
  try {
    const transporter = createTransporter()
    
    // Check if email service is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      logger.warn('Email service not configured. Skipping email send.')
      logger.warn('Set SMTP_USER and SMTP_PASSWORD in .env to enable email verification')
      return { success: false, message: 'Email service not configured' }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`

    const mailOptions = {
      from: `"CyberMaze" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your CyberMaze Account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Courier New', monospace;
                background-color: #000;
                color: #00ff00;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                border: 2px solid #00ff00;
                padding: 30px;
                background-color: rgba(0, 0, 0, 0.8);
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
              }
              h1 {
                color: #00ff00;
                text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                text-align: center;
              }
              .button {
                display: inline-block;
                padding: 15px 30px;
                background-color: #00ff00;
                color: #000;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
              }
              .button:hover {
                background-color: #00cc00;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #888;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>CYBERMAZE</h1>
              <h2>Verify Your Email Address</h2>
              <p>Hello ${username},</p>
              <p>Welcome to CyberMaze! Please verify your email address to complete your registration.</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">VERIFY EMAIL</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #00ff00;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <div class="footer">
                <p>If you didn't create an account, please ignore this email.</p>
                <p>&copy; 2025 CyberMaze. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        CyberMaze - Verify Your Email
        
        Hello ${username},
        
        Welcome to CyberMaze! Please verify your email address by clicking the link below:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, please ignore this email.
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    logger.info(`Verification email sent to ${email}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    logger.error('Error sending verification email:', error)
    return { success: false, error: error.message }
  }
}

// Send password reset email (for future use)
export const sendPasswordResetEmail = async (email, username, resetToken) => {
  try {
    const transporter = createTransporter()
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      logger.warn('Email service not configured. Skipping email send.')
      return { success: false, message: 'Email service not configured' }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: `"CyberMaze" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your CyberMaze Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Courier New', monospace;
                background-color: #000;
                color: #00ff00;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                border: 2px solid #00ff00;
                padding: 30px;
                background-color: rgba(0, 0, 0, 0.8);
              }
              h1 { color: #00ff00; text-align: center; }
              .button {
                display: inline-block;
                padding: 15px 30px;
                background-color: #00ff00;
                color: #000;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>CYBERMAZE</h1>
              <h2>Reset Your Password</h2>
              <p>Hello ${username},</p>
              <p>You requested to reset your password. Click the button below to reset it:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">RESET PASSWORD</a>
              </p>
              <p>Or copy this link: ${resetUrl}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    logger.info(`Password reset email sent to ${email}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    logger.error('Error sending password reset email:', error)
    return { success: false, error: error.message }
  }
}

