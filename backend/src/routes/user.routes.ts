import { Router } from "express";
import { UserRole } from "../generated/prisma/client";
import {
  authenticate,
  requirePermission,
  requireRoles,
  validate,
} from "../middleware";
import { Permission } from "../config";
import { asyncHandler } from "../utils";
import { userController } from "../controllers";
import {
  idParamSchema,
  listUsersQuerySchema,
  updateUserRoleSchema,
  updateUserSchema,
} from "../validators";

const router = Router();

router.use(authenticate);

router.get(
  "/me",
  asyncHandler(userController.getMe.bind(userController)),
);

router.get(
  "/",
  requirePermission(Permission.USER_READ),
  validate(listUsersQuerySchema, "query"),
  asyncHandler(userController.list.bind(userController)),
);

router.get(
  "/:id",
  requirePermission(Permission.USER_READ),
  validate(idParamSchema, "params"),
  asyncHandler(userController.getById.bind(userController)),
);

router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateUserSchema),
  asyncHandler(userController.update.bind(userController)),
);

router.patch(
  "/:id/role",
  requireRoles(UserRole.ADMIN),
  requirePermission(Permission.USER_MANAGE_ROLES),
  validate(idParamSchema, "params"),
  validate(updateUserRoleSchema),
  asyncHandler(userController.updateRole.bind(userController)),
);

// Admin unlock user
router.post('/:id/unlock', requireRoles(UserRole.ADMIN), validate(idParamSchema, 'params'), asyncHandler(userController.unlock.bind(userController)))

export default router;
