import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import { env } from "../config";
import { AppError } from "../utils";
import { logger } from "../utils";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    logger.warn(
      { err, requestId, statusCode: err.statusCode },
      err.message,
    );

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
      ...(requestId && { requestId }),
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      details: {
        issues: err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      ...(requestId && { requestId }),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = mapPrismaError(err);
    logger.warn({ err, requestId, code: err.code }, prismaError.message);

    res.status(prismaError.statusCode).json({
      success: false,
      message: prismaError.message,
      ...(requestId && { requestId }),
    });
    return;
  }

  logger.error({ err, requestId }, "Unhandled error");

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
    ...(requestId && { requestId }),
  });
}

function mapPrismaError(
  error: Prisma.PrismaClientKnownRequestError,
): { statusCode: number; message: string } {
  switch (error.code) {
    case "P2002":
      return {
        statusCode: 409,
        message: "A record with this value already exists",
      };
    case "P2025":
      return {
        statusCode: 404,
        message: "Record not found",
      };
    case "P2003":
      return {
        statusCode: 400,
        message: "Related record not found",
      };
    default:
      return {
        statusCode: 500,
        message: "Database operation failed",
      };
  }
}
