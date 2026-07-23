-- Data remap + contractor_id (run after new enum values exist).
-- This file is applied via scripts/apply-rbac-roles.ts for Railway.

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "contractor_id" TEXT;

UPDATE "users" SET "role" = 'PROJECT_ENGINEER' WHERE "role"::text = 'ENGINEER';
UPDATE "users" SET "role" = 'FINANCE_OFFICER' WHERE "role"::text = 'FINANCE';

CREATE INDEX IF NOT EXISTS "users_contractor_id_idx" ON "users"("contractor_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_contractor_id_fkey'
  ) THEN
    ALTER TABLE "users"
      ADD CONSTRAINT "users_contractor_id_fkey"
      FOREIGN KEY ("contractor_id") REFERENCES "contractors"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
