ALTER TABLE "registration_requests" ADD COLUMN "firebase_uid" TEXT;
UPDATE "registration_requests" SET "firebase_uid" = CONCAT('legacy_', "id") WHERE "firebase_uid" IS NULL;
ALTER TABLE "registration_requests" ALTER COLUMN "firebase_uid" SET NOT NULL;
CREATE UNIQUE INDEX "registration_requests_firebase_uid_key" ON "registration_requests"("firebase_uid");
