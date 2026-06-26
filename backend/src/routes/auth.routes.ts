import { Router } from "express";
import { authenticate, verifyFirebaseToken } from "../middleware";
import { validate } from "../middleware";
import { asyncHandler } from "../utils";
import { authController } from "../controllers";
import { registerUserSchema } from "../validators";

const router = Router();

router.post(
  "/register",
  verifyFirebaseToken,
  validate(registerUserSchema),
  asyncHandler(authController.register.bind(authController)),
);

router.post(
  "/login",
  authenticate,
  asyncHandler(authController.syncLogin.bind(authController)),
);

export default router;
