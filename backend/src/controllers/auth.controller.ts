import type { Request, Response } from "express";
import { authService } from "../services";
import { UnauthorizedError } from "../utils";
import { loginActivityRepository, userRepository } from "../repositories";

const LOCK_THRESHOLD = 5
const LOCK_DURATION_MINUTES = 15

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

    // record successful login activity and reset failed attempts
    try {
      await loginActivityRepository.create({
        userId: user.id,
        email: user.email,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') ?? '',
        browser: req.get('User-Agent')?.split(' ')[0] ?? 'unknown',
        device: 'unknown',
        location: undefined,
        isSuccessful: true,
      })

      await userRepository.update(user.id, { failedLoginAttempts: 0, lockedUntil: null })
    } catch (err) {
      // non-fatal
      // eslint-disable-next-line no-console
      console.warn('Failed to record login activity', err)
    }

    res.json({ success: true, message: 'Login synced', data: user })
  }

  /** Public endpoint to record a failed login attempt (called by frontend when Firebase sign-in fails) */
  async recordLoginFailure(req: Request, res: Response): Promise<void> {
    const { email, failureReason } = req.body as { email: string; failureReason?: string }
    // record activity
    await loginActivityRepository.create({
      email: email ?? 'unknown',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') ?? '',
      browser: req.get('User-Agent')?.split(' ')[0] ?? 'unknown',
      device: 'unknown',
      isSuccessful: false,
      failureReason: failureReason ?? 'login_failed',
    })

    // increment failed attempts if user exists
    const user = await userRepository.findByEmail(email)
    if (user) {
      const attempts = (user.failedLoginAttempts ?? 0) + 1
      const update: any = { failedLoginAttempts: attempts }
      if (attempts >= LOCK_THRESHOLD) {
        const until = new Date()
        until.setMinutes(until.getMinutes() + LOCK_DURATION_MINUTES)
        update.lockedUntil = until
      }
      await userRepository.update(user.id, update)
    }

    res.status(204).send()
  }

  /** Admin unlock endpoint */
  async unlockUser(req: Request, res: Response): Promise<void> {
    const targetId = req.params.id
    await userRepository.update(targetId, { failedLoginAttempts: 0, lockedUntil: null, isActive: true })
    res.json({ success: true })
  }
}

export const authController = new AuthController();
