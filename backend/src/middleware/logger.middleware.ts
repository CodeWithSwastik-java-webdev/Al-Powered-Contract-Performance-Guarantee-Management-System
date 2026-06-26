import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";
import pinoHttp from "pino-http";
import { env } from "../config";
import { logger } from "../utils";

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req: Request) => {
    const existing = req.headers["x-request-id"];
    if (typeof existing === "string" && existing.length > 0) {
      return existing;
    }
    return randomUUID();
  },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} ${res.statusCode} — ${err?.message ?? "error"}`;
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
  autoLogging: env.NODE_ENV !== "test",
});

export function attachRequestId(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  req.requestId = (req as Request & { id?: string }).id ?? randomUUID();
  next();
}
