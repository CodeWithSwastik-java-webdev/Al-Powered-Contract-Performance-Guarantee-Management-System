import { logger } from '../utils'

// Simple mock EmailService — in prod replace with real SMTP or SendGrid
class EmailService {
  async send(options: { to: string; subject: string; text?: string; html?: string }) {
    try {
      logger.info({ to: options.to, subject: options.subject }, '[EmailService] Notification queued')
      return { accepted: [options.to] }
    } catch (err) {
      logger.warn({ err }, '[EmailService] Notification failed')
      return null
    }
  }
}

export const emailService = new EmailService()
