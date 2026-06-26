import { z } from "zod";
import { UserRole } from "../generated/prisma/client";
import { paginationSchema } from "./common.validator";

export { paginationSchema, idParamSchema } from "./common.validator";

export const registerUserSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  department: z.string().max(100).trim().optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s-]{10,15}$/, "Invalid phone number")
    .optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).trim().optional(),
    department: z.string().max(100).trim().nullable().optional(),
    phone: z
      .string()
      .regex(/^[+]?[\d\s-]{10,15}$/, "Invalid phone number")
      .nullable()
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const listUsersQuerySchema = paginationSchema.extend({
  role: z.nativeEnum(UserRole).optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  search: z.string().trim().min(1).max(100).optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
