import { registrationRepository, userRepository } from '../repositories'
import { RegistrationStatus, UserRole, UserStatus, type RegistrationRequest } from '../generated/prisma/client'
import { ConflictError, NotFoundError } from '../utils'
import { emailService } from './email.service'

class RegistrationService {
  async create(data: any): Promise<RegistrationRequest> {
    const existing = await registrationRepository.findByEmail(data.email)
    if (existing) throw new ConflictError('An access request already exists for this email.')
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

  async updateStatus(id: string, status: RegistrationStatus, reviewerId: string, comment?: string) {
    const request = await registrationRepository.findById(id)
    if (!request) throw new NotFoundError('Registration request not found')
    if (request.status !== RegistrationStatus.PENDING_APPROVAL && request.status !== RegistrationStatus.MORE_INFORMATION_REQUIRED) {
      throw new ConflictError('This registration request has already been reviewed.')
    }

    if (comment) await registrationRepository.addComment(id, reviewerId, comment)

    if (status === RegistrationStatus.APPROVED) {
      const existingUser = await userRepository.findByFirebaseUid(request.firebaseUid)
      if (!existingUser) {
        await userRepository.create({
          firebaseUid: request.firebaseUid,
          name: request.name,
          email: request.email,
          phone: request.phone,
          department: request.department,
          employeeId: request.employeeId,
          role: UserRole.VIEWER,
          status: UserStatus.ACTIVE,
          isActive: true,
        })
      }
    }

    const updated = await registrationRepository.update(id, { status, reviewedBy: { connect: { id: reviewerId } } })
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
