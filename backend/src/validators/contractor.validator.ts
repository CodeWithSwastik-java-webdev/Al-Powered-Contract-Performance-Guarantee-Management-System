import { z } from "zod";
import { paginationSchema } from "./common.validator";

export const createContractorSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    contactEmail: z.string().email("Invalid contact email").optional(),
    contactPhone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const updateContractorSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    address: z.string().optional(),
    isActive: z.boolean().optional(),
    isBlacklisted: z.boolean().optional(),
  }),
});

export const listContractorsQuerySchema = z.object({
  query: paginationSchema.extend({
    search: z.string().optional(),
    isActive: z.enum(["true", "false"]).optional(),
    isBlacklisted: z.enum(["true", "false"]).optional(),
  }),
});

export type CreateContractorInput = z.infer<typeof createContractorSchema>["body"];
export type UpdateContractorInput = z.infer<typeof updateContractorSchema>["body"];
export type ListContractorsQuery = z.infer<typeof listContractorsQuerySchema>["query"];
