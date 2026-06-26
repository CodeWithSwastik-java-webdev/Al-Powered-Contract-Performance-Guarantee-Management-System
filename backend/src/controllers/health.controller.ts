import type { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class HealthController {
  async check(_req: Request, res: Response): Promise<void> {
    let database: "connected" | "disconnected" = "disconnected";

    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "connected";
    } catch {
      database = "disconnected";
    }

    const status = database === "connected" ? "ok" : "degraded";

    res.status(database === "connected" ? 200 : 503).json({
      success: database === "connected",
      data: {
        status,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database,
      },
    });
  }
}

export const healthController = new HealthController();
