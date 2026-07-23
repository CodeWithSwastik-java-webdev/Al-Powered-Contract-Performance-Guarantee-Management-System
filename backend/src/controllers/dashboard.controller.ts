import type { Request, Response } from "express";
import { dashboardService } from "../services";
import { UnauthorizedError } from "../utils";

export class DashboardController {
  async getStats(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const stats = await dashboardService.getStats(req.user);
    res.status(200).json({ success: true, data: stats });
  }

  async getRecentActivity(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const activity = await dashboardService.getRecentActivity(req.user);
    res.status(200).json({ success: true, data: activity });
  }

  async getCharts(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const charts = await dashboardService.getCharts(req.user);
    res.status(200).json({ success: true, data: charts });
  }

  async getExpiringSoon(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const expiringSoon = await dashboardService.getExpiringSoon(req.user);
    res.status(200).json({ success: true, data: expiringSoon });
  }
}

export const dashboardController = new DashboardController();
