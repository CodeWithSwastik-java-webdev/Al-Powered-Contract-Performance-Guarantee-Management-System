import { z } from "zod";
import { ContractStatus } from "../generated/prisma/client";
import {
  dateSchema,
  idParamSchema,
  paginationSchema,
  positiveDecimalSchema,
} from "./common.validator";

export { idParamSchema };

export const createContractSchema = z
  .object({
    contractNumber: z.string().min(1).max(50).trim(),
    projectName: z.string().min(2).max(200).trim(),
    description: z.string().max(2000).trim().optional(),
    contractValue: positiveDecimalSchema,
    currency: z.string().length(3).default("INR"),
    awardDate: dateSchema,
    completionDate: dateSchema.optional(),
    status: z.nativeEnum(ContractStatus).default(ContractStatus.DRAFT),
    zone: z.string().max(10).trim().optional(),
    contractorId: z.string().cuid("Invalid contractor ID"),
  })
  .refine(
    (data) =>
      !data.completionDate || data.completionDate >= data.awardDate,
    {
      message: "Completion date must be on or after award date",
      path: ["completionDate"],
    },
  );

export const updateContractSchema = z
  .object({
    projectName: z.string().min(2).max(200).trim().optional(),
    description: z.string().max(2000).trim().nullable().optional(),
    contractValue: positiveDecimalSchema.optional(),
    currency: z.string().length(3).optional(),
    awardDate: dateSchema.optional(),
    completionDate: dateSchema.nullable().optional(),
    status: z.nativeEnum(ContractStatus).optional(),
    zone: z.string().max(10).trim().nullable().optional(),
    contractorId: z.string().cuid("Invalid contractor ID").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const listContractsQuerySchema = paginationSchema.extend({
  status: z.nativeEnum(ContractStatus).optional(),
  zone: z.string().trim().min(1).max(10).optional(),
  contractorId: z.string().cuid().optional(),
  search: z.string().trim().min(1).max(100).optional(),
});

export type CreateContractInput = z.infer<typeof createContractSchema>;
export type UpdateContractInput = z.infer<typeof updateContractSchema>;
export type ListContractsQuery = z.infer<typeof listContractsQuerySchema>;
