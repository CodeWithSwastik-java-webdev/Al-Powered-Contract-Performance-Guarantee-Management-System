import type { Request, Response, NextFunction } from "express";
import { userRepository } from "../repositories";
import { ForbiddenError, UnauthorizedError, readAccessToken } from "../utils";

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7).trim() : "";
    const payload = token ? readAccessToken(token) : null;
    if (!payload) throw new UnauthorizedError("Please sign in again.");
    const user = await userRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedError("Account not found.");
    if (!user.isActive || user.status !== "ACTIVE") throw new ForbiddenError(`Account status: ${user.status}`);
    if (user.lockedUntil && user.lockedUntil > new Date()) throw new ForbiddenError("Account is locked due to multiple failed login attempts.");
    req.user = user;
    next();
  } catch (error) { next(error instanceof UnauthorizedError || error instanceof ForbiddenError ? error : new UnauthorizedError("Invalid access token.")); }
}

export function optionalAuthenticate(req: Request, res: Response, next: NextFunction): void {
  if (!req.headers.authorization?.startsWith("Bearer ")) { next(); return; }
  void authenticate(req, res, next);
}
