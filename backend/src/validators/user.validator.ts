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

const uploadedDocumentSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url(),
  publicId: z.string().min(1).max(500),
  type: z.string().min(1).max(100),
  size: z.number().int().nonnegative().optional(),
});

export const createRegistrationSchema = z
  .object({
    category: z.enum(["EMPLOYEE", "CONTRACTOR"]),
    name: z.string().min(2).max(150).trim(),
    email: z.string().email().transform((value) => value.toLowerCase().trim()),
    phone: z.string().min(8).max(20).optional(),
    department: z.string().max(150).optional(),
    employeeId: z.string().max(100).optional(),
    designation: z.string().max(150).optional(),
    region: z.string().max(100).optional(),
    companyName: z.string().max(200).optional(),
    contactPerson: z.string().max(150).optional(),
    companyAddress: z.string().max(500).optional(),
    gstNumber: z.string().max(30).optional(),
    panNumber: z.string().max(30).optional(),
    companyWebsite: z.string().url().optional().or(z.literal("")),
    uploadedDocs: z.array(uploadedDocumentSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.category === "EMPLOYEE" && (!data.employeeId || !data.department)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Employee ID and department are required for employees." });
    }
    if (data.category === "CONTRACTOR" && (!data.companyName || !data.contactPerson || !data.gstNumber || !data.panNumber)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Company, authorized person, GST, and PAN are required for contractors." });
    }
  });

export const updateRegistrationStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "MORE_INFORMATION_REQUIRED"]),
  comment: z.string().min(2).max(1000).optional(),
});
