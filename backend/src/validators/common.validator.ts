import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({
  id: z.string().cuid("Invalid ID format"),
});

export const dateSchema = z.coerce.date({
  required_error: "Date is required",
  invalid_type_error: "Invalid date format",
});

export const positiveDecimalSchema = z.coerce
  .number()
  .positive("Amount must be greater than zero");
