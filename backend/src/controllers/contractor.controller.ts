import type { Request, Response } from "express";
import { contractorService } from "../services";
import { UnauthorizedError } from "../utils";
import type {
  CreateContractorInput,
  ListContractorsQuery,
  UpdateContractorInput,
} from "../validators";

export class ContractorController {
  async create(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const contractor = await contractorService.create(req.body as CreateContractorInput);
    res.status(201).json({ success: true, data: contractor });
  }

  async list(req: Request, res: Response): Promise<void> {
    const result = await contractorService.list(req.query as unknown as ListContractorsQuery);
    res.status(200).json({ success: true, data: result.items, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const contractor = await contractorService.getById(String(req.params.id));
    res.status(200).json({ success: true, data: contractor });
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const contractor = await contractorService.update(
      String(req.params.id),
      req.body as UpdateContractorInput,
    );
    res.status(200).json({ success: true, data: contractor });
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    await contractorService.delete(String(req.params.id));
    res.status(204).send();
  }
}

export const contractorController = new ContractorController();
