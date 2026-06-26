import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../generated/prisma/client";
import { roleHasAllPermissions, roleHasAnyPermission } from "../config";
import type { Permission } from "../config";
import { ForbiddenError, UnauthorizedError } from "../utils";

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(
        new ForbiddenError(
          `Requires one of the following roles: ${roles.join(", ")}`,
        ),
      );
      return;
    }

    next();
  };
}

export function requirePermission(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    if (!roleHasAllPermissions(req.user.role, permissions)) {
      next(
        new ForbiddenError(
          "Insufficient permissions to perform this action",
        ),
      );
      return;
    }

    next();
  };
}

export function requireAnyPermission(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    if (!roleHasAnyPermission(req.user.role, permissions)) {
      next(
        new ForbiddenError(
          "Insufficient permissions to perform this action",
        ),
      );
      return;
    }

    next();
  };
}
