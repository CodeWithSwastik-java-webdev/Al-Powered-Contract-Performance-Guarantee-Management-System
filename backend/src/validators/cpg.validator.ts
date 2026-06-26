import { z } from "zod";
import { BankGuaranteeType, CpgStatus } from "../generated/prisma/client";
import {
  dateSchema,
  idParamSchema,
  paginationSchema,
  positiveDecimalSchema,
} from "./common.validator";

export { idParamSchema };

export const createCpgSchema = z
  .object({
    contractId: z.string().cuid("Invalid contract ID"),
    bgNumber: z.string().min(1).max(50).trim(),
    bgType: z
      .nativeEnum(BankGuaranteeType)
      .default(BankGuaranteeType.PERFORMANCE_BANK_GUARANTEE),
    bankName: z.string().min(2).max(150).trim(),
    bankBranch: z.string().max(150).trim().optional(),
    ifscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
      .optional(),
    amount: positiveDecimalSchema,
    issueDate: dateSchema,
    expiryDate: dateSchema,
    claimPeriodEnd: dateSchema,
    remarks: z.string().max(1000).trim().optional(),
  })
  .refine((data) => data.expiryDate > data.issueDate, {
    message: "Expiry date must be after issue date",
    path: ["expiryDate"],
  })
  .refine((data) => data.claimPeriodEnd >= data.expiryDate, {
    message: "Claim period end must be on or after expiry date",
    path: ["claimPeriodEnd"],
  });

export const extendCpgSchema = z
  .object({
    bgNumber: z.string().min(1).max(50).trim(),
    expiryDate: dateSchema,
    claimPeriodEnd: dateSchema,
    amount: positiveDecimalSchema.optional(),
    issueDate: dateSchema.optional(),
    remarks: z.string().max(1000).trim().optional(),
  })
  .refine((data) => data.claimPeriodEnd >= data.expiryDate, {
    message: "Claim period end must be on or after expiry date",
    path: ["claimPeriodEnd"],
  });

export const cpgActionSchema = z.object({
  remarks: z.string().max(1000).trim().optional(),
});

export const listCpgsQuerySchema = paginationSchema.extend({
  contractId: z.string().cuid().optional(),
  status: z.nativeEnum(CpgStatus).optional(),
  search: z.string().trim().min(1).max(100).optional(),
});

export type CreateCpgInput = z.infer<typeof createCpgSchema>;
export type ExtendCpgInput = z.infer<typeof extendCpgSchema>;
export type CpgActionInput = z.infer<typeof cpgActionSchema>;
export type ListCpgsQuery = z.infer<typeof listCpgsQuerySchema>;
