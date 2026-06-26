import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { BadRequestError } from "../utils";

type RequestSource = "body" | "query" | "params";

export function validate(
  schema: z.ZodTypeAny,
  source: RequestSource = "body",
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new BadRequestError("Validation failed", {
            issues: error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          }),
        );
        return;
      }
      next(error);
    }
  };
}
