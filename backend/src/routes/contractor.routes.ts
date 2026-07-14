import { Router } from "express";
import {
  authenticate,
  requirePermission,
  validate,
} from "../middleware";
import { Permission } from "../config";
import { asyncHandler } from "../utils";
import { contractorController } from "../controllers";
import {
  createContractorSchema,
  listContractorsQuerySchema,
  updateContractorSchema,
} from "../validators/contractor.validator";
import { idParamSchema } from "../validators/common.validator";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission(Permission.CONTRACT_WRITE),
  validate(createContractorSchema),
  asyncHandler(contractorController.create.bind(contractorController)),
);

router.get(
  "/",
  requirePermission(Permission.CONTRACT_READ),
  validate(listContractorsQuerySchema, "query"),
  asyncHandler(contractorController.list.bind(contractorController)),
);

router.get(
  "/:id",
  requirePermission(Permission.CONTRACT_READ),
  validate(idParamSchema, "params"),
  asyncHandler(contractorController.getById.bind(contractorController)),
);

router.patch(
  "/:id",
  requirePermission(Permission.CONTRACT_WRITE),
  validate(idParamSchema, "params"),
  validate(updateContractorSchema),
  asyncHandler(contractorController.update.bind(contractorController)),
);

router.delete(
  "/:id",
  requirePermission(Permission.CONTRACT_WRITE),
  validate(idParamSchema, "params"),
  asyncHandler(contractorController.delete.bind(contractorController)),
);

export default router;
