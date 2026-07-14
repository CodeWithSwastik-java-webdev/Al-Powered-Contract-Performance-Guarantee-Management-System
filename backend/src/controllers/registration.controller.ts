import type { Request, Response } from 'express'
import { registrationService } from '../services'

export class RegistrationController {
  async create(req: Request, res: Response): Promise<void> {
    if (!req.firebaseUid) throw new Error('Missing Firebase identity')
    const data = { ...req.body, firebaseUid: req.firebaseUid }
    const created = await registrationService.create(data)
    res.status(201).json({ success: true, data: created })
  }

  async list(req: Request, res: Response): Promise<void> {
    const { skip = 0, take = 20, status, category } = req.query as any
    const where: any = {}
    if (status) where.status = status
    if (category) where.category = category
    const result = await registrationService.list({ skip: Number(skip), take: Number(take), where })
    res.json({ success: true, data: result })
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id)
    const item = await registrationService.getById(id)
    res.json({ success: true, data: item })
  }

  async addComment(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id)
    const authorId = req.user?.id
    if (!authorId) throw new Error('Missing reviewer identity')
    const { content } = req.body
    const comment = await registrationService.addComment(id, authorId, content)
    res.status(201).json({ success: true, data: comment })
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id)
    const { status, comment } = req.body
    const reviewerId = req.user?.id
    if (!reviewerId) throw new Error('Missing reviewer identity')
    const updated = await registrationService.updateStatus(id, status, reviewerId, comment)
    res.json({ success: true, data: updated })
  }
}

export const registrationController = new RegistrationController()
