import { registrationRepository, userRepository } from '../repositories'
import type { RegistrationRequest } from '../generated/prisma/client'
import { emailService } from './email.service'

class RegistrationService {
  async create(data: any): Promise<RegistrationRequest> {
    const req = await registrationRepository.create(data)
    // send confirmation email (mock)
    emailService.send({
      to: req.email,
      subject: 'Registration submitted — POWERGRID',
      text: `Your application ${req.id} has been submitted and is pending review.`,
    })
    return req
  }

  async list(params: any) {
    return registrationRepository.findMany(params)
  }

  async getById(id: string) {
    return registrationRepository.findById(id)
  }

  async addComment(requestId: string, authorId: string, content: string) {
    return registrationRepository.addComment(requestId, authorId, content)
  }

  async updateStatus(id: string, status: string, reviewerId?: string) {
    const updated = await registrationRepository.update(id, { status, reviewedById: reviewerId })
    // notify applicant
    emailService.send({
      to: updated.email,
      subject: `Registration ${status} — POWERGRID`,
      text: `Your registration ${updated.id} status has been updated to ${status}.`,
    })
    return updated
  }
}

export const registrationService = new RegistrationService()
