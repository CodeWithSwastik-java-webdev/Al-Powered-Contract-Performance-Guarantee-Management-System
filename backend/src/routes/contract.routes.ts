import { Router } from "express";
import {
  authenticate,
  requirePermission,
  validate,
} from "../middleware";
import { Permission } from "../config";
import { asyncHandler } from "../utils";
import { contractController } from "../controllers";
import {
  createContractSchema,
  idParamSchema,
  listContractsQuerySchema,
  updateContractSchema,
} from "../validators";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission(Permission.CONTRACT_WRITE),
  validate(createContractSchema),
  asyncHandler(contractController.create.bind(contractController)),
);

router.get(
  "/",
  requirePermission(Permission.CONTRACT_READ),
  validate(listContractsQuerySchema, "query"),
  asyncHandler(contractController.list.bind(contractController)),
);

router.get(
  "/:id",
  requirePermission(Permission.CONTRACT_READ),
  validate(idParamSchema, "params"),
  asyncHandler(contractController.getById.bind(contractController)),
);

router.patch(
  "/:id",
  requirePermission(Permission.CONTRACT_WRITE),
  validate(idParamSchema, "params"),
  validate(updateContractSchema),
  asyncHandler(contractController.update.bind(contractController)),
);

router.delete(
  "/:id",
  requirePermission(Permission.CONTRACT_WRITE),
  validate(idParamSchema, "params"),
  asyncHandler(contractController.delete.bind(contractController)),
);

export default router;
