import type { Request, Response } from "express";
import { authService } from "../services";
import { UnauthorizedError } from "../utils";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    if (!req.firebaseUid) {
      throw new UnauthorizedError();
    }

    const user = await authService.registerUser(req.firebaseUid, req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }

  async syncLogin(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await authService.syncLogin(req.user.firebaseUid);

    res.json({
      success: true,
      message: "Login synced",
      data: user,
    });
  }
}

export const authController = new AuthController();
