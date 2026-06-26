import type { Request, Response } from "express";
import { cpgService, anomalyDetectionService } from "../services";
import { auditContextFromRequest } from "../types/audit";
import type {
  CreateCpgInput,
  CpgActionInput,
  ExtendCpgInput,
  ListCpgsQuery,
} from "../validators";

export class CpgController {
  async create(req: Request, res: Response): Promise<void> {
    const cpg = await cpgService.create(
      req.body as CreateCpgInput,
      auditContextFromRequest(req),
    );

    res.status(201).json({
      success: true,
      message: "CPG created successfully",
      data: cpg,
    });
  }

  async list(req: Request, res: Response): Promise<void> {
    const result = await cpgService.list(
      req.query as unknown as ListCpgsQuery,
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
    const cpg = await cpgService.getById(String(req.params.id));

    res.json({
      success: true,
      data: cpg,
    });
  }

  async verify(req: Request, res: Response): Promise<void> {
    const result = await cpgService.verify(
      String(req.params.id),
      req.body as CpgActionInput,
      auditContextFromRequest(req),
    );

    res.json({
      success: true,
      message: "CPG verified successfully",
      data: result,
    });
  }

  async extend(req: Request, res: Response): Promise<void> {
    const result = await cpgService.extend(
      String(req.params.id),
      req.body as ExtendCpgInput,
      auditContextFromRequest(req),
    );

    res.status(201).json({
      success: true,
      message: "CPG extended successfully",
      data: result,
    });
  }

  async release(req: Request, res: Response): Promise<void> {
    const cpg = await cpgService.release(
      String(req.params.id),
      req.body as CpgActionInput,
      auditContextFromRequest(req),
    );

    res.json({
      success: true,
      message: "CPG released successfully",
      data: cpg,
    });
  }

  async expire(req: Request, res: Response): Promise<void> {
    const cpg = await cpgService.expire(
      String(req.params.id),
      req.body as CpgActionInput,
      auditContextFromRequest(req),
    );

    res.json({
      success: true,
      message: "CPG expired successfully",
      data: cpg,
    });
  }

  async getAnomalies(req: Request, res: Response): Promise<void> {
    const cpgId = String(req.params.id);
    const result = await anomalyDetectionService.runAnomalyDetection(cpgId);

    res.json({
      success: true,
      data: result,
    });
  }

  async runAnomalyScan(req: Request, res: Response): Promise<void> {
    const cpgId = String(req.params.id);
    const { result, assessment } =
      await anomalyDetectionService.detectAndStoreAnomalies(cpgId);

    res.json({
      success: true,
      message: "Anomaly scan completed",
      data: { result, assessment },
    });
  }

  async getRiskHistory(req: Request, res: Response): Promise<void> {
    const history = await anomalyDetectionService.getAssessmentHistory(
      String(req.params.id),
    );

    res.json({
      success: true,
      data: history,
    });
  }
}

export const cpgController = new CpgController();
