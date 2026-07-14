import type { Request, Response } from 'express'
import { registrationService } from '../services'

export class RegistrationController {
  async create(req: Request, res: Response): Promise<void> {
    const data = req.body
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
    const id = req.params.id
    const item = await registrationService.getById(id)
    res.json({ success: true, data: item })
  }

  async addComment(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const authorId = req.user?.id
    const { content } = req.body
    const comment = await registrationService.addComment(id, authorId, content)
    res.status(201).json({ success: true, data: comment })
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const { status } = req.body
    const reviewerId = req.user?.id
    const updated = await registrationService.updateStatus(id, status, reviewerId)
    res.json({ success: true, data: updated })
  }
}

export const registrationController = new RegistrationController()
