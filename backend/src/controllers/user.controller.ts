import type { Request, Response } from "express";
import { userService } from "../services";
import { UnauthorizedError } from "../utils";

import type { ListUsersQuery } from "../validators";

export class UserController {
  async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await userService.getMe(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  }

  async list(req: Request, res: Response): Promise<void> {
    const result = await userService.list(
      req.query as unknown as ListUsersQuery,
    );

    res.json({
      success: true,
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const user = await userService.getById(String(req.params.id));

    res.json({
      success: true,
      data: user,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await userService.update(
      String(req.params.id),
      req.body,
      req.user,
    );

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await userService.updateRole(
      String(req.params.id),
      req.body,
      req.user,
    );

    res.json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  }
}

export const userController = new UserController();
