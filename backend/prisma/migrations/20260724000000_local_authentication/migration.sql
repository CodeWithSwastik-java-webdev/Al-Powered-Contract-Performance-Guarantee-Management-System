ALTER TABLE "users" ADD COLUMN "password_hash" TEXT;
ALTER TABLE "registration_requests" ADD COLUMN "password_hash" TEXT;
UPDATE "registration_requests" SET "password_hash" = 'legacy-unusable' WHERE "password_hash" IS NULL;
ALTER TABLE "registration_requests" ALTER COLUMN "password_hash" SET NOT NULL;
