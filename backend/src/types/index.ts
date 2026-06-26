export type { User } from "../generated/prisma/client";
export { UserRole } from "../generated/prisma/client";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
