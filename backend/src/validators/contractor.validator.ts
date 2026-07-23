import { z } from "zod";
import { paginationSchema } from "./common.validator";

export const createContractorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactEmail: z.string().email("Invalid contact email").optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
});

export const updateContractorSchema = z
  .object({
    name: z.string().min(2).optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    address: z.string().optional(),
    isActive: z.boolean().optional(),
    isBlacklisted: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const listContractorsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  isActive: z.enum(["true", "false"]).optional(),
  isBlacklisted: z.enum(["true", "false"]).optional(),
});

export type CreateContractorInput = z.infer<typeof createContractorSchema>;
export type UpdateContractorInput = z.infer<typeof updateContractorSchema>;
export type ListContractorsQuery = z.infer<typeof listContractorsQuerySchema>;
