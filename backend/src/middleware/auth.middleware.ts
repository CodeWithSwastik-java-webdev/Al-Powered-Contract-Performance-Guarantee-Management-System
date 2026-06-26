import type { Request, Response, NextFunction } from "express";
import { getFirebaseAuth } from "../config";
import { UnauthorizedError, ForbiddenError } from "../utils";
import { userRepository } from "../repositories";

async function verifyBearerToken(req: Request): Promise<string> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid Authorization header");
  }

  const idToken = authHeader.slice(7).trim();
  if (!idToken) {
    throw new UnauthorizedError("Bearer token is empty");
  }

  const decoded = await getFirebaseAuth().verifyIdToken(idToken);
  req.firebaseUid = decoded.uid;
  return decoded.uid;
}

/** Verifies Firebase ID token only — used for first-time registration. */
export async function verifyFirebaseToken(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await verifyBearerToken(req);
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }

    next(new UnauthorizedError("Invalid or expired authentication token"));
  }
}

/** Verifies Firebase token and loads the registered, active user from DB. */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const firebaseUid = await verifyBearerToken(req);
    const user = await userRepository.findByFirebaseUid(firebaseUid);

    if (!user) {
      throw new UnauthorizedError(
        "User not registered in the system. Contact an administrator.",
      );
    }

    if (!user.isActive) {
      throw new ForbiddenError("Account is deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      next(error);
      return;
    }

    next(new UnauthorizedError("Invalid or expired authentication token"));
  }
}

export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next();
    return;
  }

  try {
    await authenticate(req, _res, next);
  } catch {
    next();
  }
}
