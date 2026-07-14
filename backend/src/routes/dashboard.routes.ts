import { Router } from "express";
import { dashboardController } from "../controllers";
import { authenticate } from "../middleware";
import { asyncHandler } from "../utils";

const router = Router();

router.use(authenticate);

router.get(
  "/stats",
  asyncHandler(dashboardController.getStats.bind(dashboardController)),
);

router.get(
  "/recent-activity",
  asyncHandler(dashboardController.getRecentActivity.bind(dashboardController)),
);

router.get(
  "/charts",
  asyncHandler(dashboardController.getCharts.bind(dashboardController)),
);

router.get(
  "/expiring-soon",
  asyncHandler(dashboardController.getExpiringSoon.bind(dashboardController)),
);

export default router;
