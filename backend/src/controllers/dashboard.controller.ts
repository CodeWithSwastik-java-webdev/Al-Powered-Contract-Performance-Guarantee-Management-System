import type { Request, Response } from "express";
import { dashboardService } from "../services";
import { UnauthorizedError } from "../utils";

export class DashboardController {
  async getStats(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const stats = await dashboardService.getStats();
    res.status(200).json({ success: true, data: stats });
  }

  async getRecentActivity(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const activity = await dashboardService.getRecentActivity();
    res.status(200).json({ success: true, data: activity });
  }

  async getCharts(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const charts = await dashboardService.getCharts();
    res.status(200).json({ success: true, data: charts });
  }

  async getExpiringSoon(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const expiringSoon = await dashboardService.getExpiringSoon();
    res.status(200).json({ success: true, data: expiringSoon });
  }
}

export const dashboardController = new DashboardController();
