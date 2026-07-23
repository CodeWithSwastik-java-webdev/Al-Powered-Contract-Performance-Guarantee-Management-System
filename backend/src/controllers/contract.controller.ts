import type { Request, Response } from "express";
import { contractService } from "../services";
import { UnauthorizedError } from "../utils";
import { auditContextFromRequest } from "../types/audit";
import type { CreateContractInput, ListContractsQuery, UpdateContractInput } from "../validators";

export class ContractController {
  async create(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const contract = await contractService.create(
      req.body as CreateContractInput,
      req.user,
      auditContextFromRequest(req),
    );

    res.status(201).json({
      success: true,
      message: "Contract created successfully",
      data: contract,
    });
  }

  async list(req: Request, res: Response): Promise<void> {
    const result = await contractService.list(
      req.query as unknown as ListContractsQuery,
      req.user,
    );

    res.json({
      success: true,
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const contract = await contractService.getById(String(req.params.id), req.user);

    res.json({
      success: true,
      data: contract,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const contract = await contractService.update(
      String(req.params.id),
      req.body as UpdateContractInput,
      req.user,
      auditContextFromRequest(req),
    );

    res.json({
      success: true,
      message: "Contract updated successfully",
      data: contract,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    await contractService.delete(
      String(req.params.id),
      auditContextFromRequest(req),
    );

    res.json({
      success: true,
      message: "Contract deleted successfully",
    });
  }
}

export const contractController = new ContractController();
