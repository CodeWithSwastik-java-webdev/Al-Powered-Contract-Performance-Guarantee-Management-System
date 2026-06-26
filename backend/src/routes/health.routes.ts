import { Router } from "express";
import { asyncHandler } from "../utils";
import { healthController } from "../controllers";

const router = Router();

router.get("/", asyncHandler(healthController.check.bind(healthController)));

export default router;
