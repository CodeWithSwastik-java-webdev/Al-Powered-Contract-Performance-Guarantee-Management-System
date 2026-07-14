import nodemailer from 'nodemailer'
import { logger } from '../utils'

// Simple mock EmailService — in prod replace with real SMTP or SendGrid
class EmailService {
  transporter: nodemailer.Transporter

  constructor() {
    // use ethereal or a no-op transporter depending on env
    this.transporter = nodemailer.createTransport({ jsonTransport: true })
  }

  async send(options: { to: string; subject: string; text?: string; html?: string }) {
    try {
      const info = await this.transporter.sendMail({
        from: 'no-reply@powergrid.local',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      })
      logger.info('[EmailService] Sent', { to: options.to, subject: options.subject, info })
      return info
    } catch (err) {
      logger.warn('[EmailService] Failed to send email', err)
      return null
    }
  }
}

export const emailService = new EmailService()
