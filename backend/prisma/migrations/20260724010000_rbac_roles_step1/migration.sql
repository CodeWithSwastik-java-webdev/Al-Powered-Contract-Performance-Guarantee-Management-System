-- Expand UserRole for enterprise RBAC and link contractor portal users.

-- 1) Add new enum values (Postgres requires commit before use in some cases; Prisma runs in a transaction — use ALTER TYPE ... ADD VALUE IF NOT EXISTS where available)
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PROJECT_ENGINEER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'FINANCE_OFFICER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'CONTRACT_MANAGER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'AUDITOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'CONTRACTOR';
