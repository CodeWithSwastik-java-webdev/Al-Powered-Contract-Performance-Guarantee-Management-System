import { Router } from "express";
import {
  authenticate,
  requireAnyPermission,
  requirePermission,
  validate,
} from "../middleware";
import { Permission } from "../config";
import { asyncHandler } from "../utils";
import { cpgController } from "../controllers";
import {
  cpgActionSchema,
  createCpgSchema,
  extendCpgSchema,
  idParamSchema,
  listCpgsQuerySchema,
} from "../validators";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission(Permission.CPG_WRITE),
  validate(createCpgSchema),
  asyncHandler(cpgController.create.bind(cpgController)),
);

router.get(
  "/",
  requirePermission(Permission.CPG_READ),
  validate(listCpgsQuerySchema, "query"),
  asyncHandler(cpgController.list.bind(cpgController)),
);

router.get(
  "/:id",
  requirePermission(Permission.CPG_READ),
  validate(idParamSchema, "params"),
  asyncHandler(cpgController.getById.bind(cpgController)),
);

router.post(
  "/:id/verify",
  requirePermission(Permission.CPG_WRITE),
  validate(idParamSchema, "params"),
  validate(cpgActionSchema),
  asyncHandler(cpgController.verify.bind(cpgController)),
);

router.post(
  "/:id/extend",
  requirePermission(Permission.CPG_WRITE),
  validate(idParamSchema, "params"),
  validate(extendCpgSchema),
  asyncHandler(cpgController.extend.bind(cpgController)),
);

router.post(
  "/:id/release",
  requireAnyPermission(Permission.CPG_MANAGE_STATUS, Permission.CPG_WRITE),
  validate(idParamSchema, "params"),
  validate(cpgActionSchema),
  asyncHandler(cpgController.release.bind(cpgController)),
);

router.post(
  "/:id/expire",
  requireAnyPermission(Permission.CPG_MANAGE_STATUS, Permission.CPG_WRITE),
  validate(idParamSchema, "params"),
  validate(cpgActionSchema),
  asyncHandler(cpgController.expire.bind(cpgController)),
);

router.get(
  "/:id/anomalies",
  requirePermission(Permission.RISK_READ),
  validate(idParamSchema, "params"),
  asyncHandler(cpgController.getAnomalies.bind(cpgController)),
);

router.post(
  "/:id/anomalies/scan",
  requirePermission(Permission.RISK_READ),
  validate(idParamSchema, "params"),
  asyncHandler(cpgController.runAnomalyScan.bind(cpgController)),
);

router.get(
  "/:id/risk-assessments",
  requirePermission(Permission.RISK_READ),
  validate(idParamSchema, "params"),
  asyncHandler(cpgController.getRiskHistory.bind(cpgController)),
);

export default router;
