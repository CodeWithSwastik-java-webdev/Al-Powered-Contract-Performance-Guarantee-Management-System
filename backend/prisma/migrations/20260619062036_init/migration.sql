-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ENGINEER', 'FINANCE', 'VIEWER');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'TERMINATED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CpgStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CLAIMED', 'INVOKED', 'RELEASED', 'RENEWED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BankGuaranteeType" AS ENUM ('PERFORMANCE_BANK_GUARANTEE', 'ADVANCE_BANK_GUARANTEE', 'SECURITY_DEPOSIT', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('BANK_GUARANTEE', 'CONTRACT_COPY', 'EXTENSION_LETTER', 'CLAIM_NOTICE', 'RELEASE_LETTER', 'RENEWAL_LETTER', 'CORRESPONDENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "AuditEntityType" AS ENUM ('USER', 'CONTRACTOR', 'CONTRACT', 'CPG', 'DOCUMENT', 'RISK_ASSESSMENT', 'ML_PREDICTION', 'NOTIFICATION');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'UPLOAD', 'DOWNLOAD', 'LOGIN', 'LOGOUT', 'EXPORT', 'INVOCATION', 'RELEASE', 'RENEWAL');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EXPIRY_ALERT', 'CLAIM_PERIOD_ALERT', 'ANOMALY_DETECTED', 'STATUS_CHANGE', 'RISK_ESCALATION', 'DOCUMENT_UPLOADED', 'SYSTEM', 'REMINDER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "department" TEXT,
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contractors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vendor_code" TEXT NOT NULL,
    "gst_number" TEXT,
    "pan_number" TEXT,
    "contact_person" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "state" TEXT,
    "rating" DECIMAL(3,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contractors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "contract_number" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "description" TEXT,
    "contract_value" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "award_date" DATE NOT NULL,
    "completion_date" DATE,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "zone" TEXT,
    "contractor_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpgs" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "bg_number" TEXT NOT NULL,
    "bg_type" "BankGuaranteeType" NOT NULL DEFAULT 'PERFORMANCE_BANK_GUARANTEE',
    "bank_name" TEXT NOT NULL,
    "bank_branch" TEXT,
    "ifsc_code" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "issue_date" DATE NOT NULL,
    "expiry_date" DATE NOT NULL,
    "claim_period_end" DATE NOT NULL,
    "status" "CpgStatus" NOT NULL DEFAULT 'ACTIVE',
    "remarks" TEXT,
    "renewed_from_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cpgs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "cpg_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "cloudinary_public_id" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "mime_type" TEXT,
    "file_size_bytes" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "uploaded_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "entity_type" "AuditEntityType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "related_entity_type" "AuditEntityType",
    "related_entity_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_assessments" (
    "id" TEXT NOT NULL,
    "cpg_id" TEXT NOT NULL,
    "health_score" DECIMAL(5,2) NOT NULL,
    "risk_level" "RiskLevel" NOT NULL,
    "anomaly_detected" BOOLEAN NOT NULL DEFAULT false,
    "anomaly_reason" TEXT,
    "factors" JSONB,
    "assessed_by_system" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ml_predictions" (
    "id" TEXT NOT NULL,
    "cpg_id" TEXT NOT NULL,
    "risk_probability" DECIMAL(5,4) NOT NULL,
    "delay_probability" DECIMAL(5,4) NOT NULL,
    "model_version" TEXT NOT NULL,
    "confidence_score" DECIMAL(5,4),
    "features" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ml_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "contractors_vendor_code_key" ON "contractors"("vendor_code");

-- CreateIndex
CREATE INDEX "contractors_name_idx" ON "contractors"("name");

-- CreateIndex
CREATE INDEX "contractors_email_idx" ON "contractors"("email");

-- CreateIndex
CREATE INDEX "contractors_is_active_is_blacklisted_idx" ON "contractors"("is_active", "is_blacklisted");

-- CreateIndex
CREATE INDEX "contractors_created_at_idx" ON "contractors"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contract_number_key" ON "contracts"("contract_number");

-- CreateIndex
CREATE INDEX "contracts_contractor_id_idx" ON "contracts"("contractor_id");

-- CreateIndex
CREATE INDEX "contracts_status_idx" ON "contracts"("status");

-- CreateIndex
CREATE INDEX "contracts_award_date_idx" ON "contracts"("award_date");

-- CreateIndex
CREATE INDEX "contracts_completion_date_idx" ON "contracts"("completion_date");

-- CreateIndex
CREATE INDEX "contracts_zone_idx" ON "contracts"("zone");

-- CreateIndex
CREATE INDEX "contracts_created_at_idx" ON "contracts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cpgs_bg_number_key" ON "cpgs"("bg_number");

-- CreateIndex
CREATE INDEX "cpgs_contract_id_idx" ON "cpgs"("contract_id");

-- CreateIndex
CREATE INDEX "cpgs_status_idx" ON "cpgs"("status");

-- CreateIndex
CREATE INDEX "cpgs_expiry_date_idx" ON "cpgs"("expiry_date");

-- CreateIndex
CREATE INDEX "cpgs_claim_period_end_idx" ON "cpgs"("claim_period_end");

-- CreateIndex
CREATE INDEX "cpgs_issue_date_idx" ON "cpgs"("issue_date");

-- CreateIndex
CREATE INDEX "cpgs_bank_name_idx" ON "cpgs"("bank_name");

-- CreateIndex
CREATE INDEX "cpgs_status_expiry_date_idx" ON "cpgs"("status", "expiry_date");

-- CreateIndex
CREATE INDEX "cpgs_created_at_idx" ON "cpgs"("created_at");

-- CreateIndex
CREATE INDEX "documents_cpg_id_idx" ON "documents"("cpg_id");

-- CreateIndex
CREATE INDEX "documents_uploaded_by_idx" ON "documents"("uploaded_by");

-- CreateIndex
CREATE INDEX "documents_document_type_idx" ON "documents"("document_type");

-- CreateIndex
CREATE INDEX "documents_is_active_idx" ON "documents"("is_active");

-- CreateIndex
CREATE INDEX "documents_created_at_idx" ON "documents"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_created_at_idx" ON "audit_logs"("entity_type", "created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_related_entity_type_related_entity_id_idx" ON "notifications"("related_entity_type", "related_entity_id");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "risk_assessments_cpg_id_idx" ON "risk_assessments"("cpg_id");

-- CreateIndex
CREATE INDEX "risk_assessments_cpg_id_created_at_idx" ON "risk_assessments"("cpg_id", "created_at");

-- CreateIndex
CREATE INDEX "risk_assessments_risk_level_idx" ON "risk_assessments"("risk_level");

-- CreateIndex
CREATE INDEX "risk_assessments_anomaly_detected_idx" ON "risk_assessments"("anomaly_detected");

-- CreateIndex
CREATE INDEX "risk_assessments_created_at_idx" ON "risk_assessments"("created_at");

-- CreateIndex
CREATE INDEX "ml_predictions_cpg_id_idx" ON "ml_predictions"("cpg_id");

-- CreateIndex
CREATE INDEX "ml_predictions_cpg_id_created_at_idx" ON "ml_predictions"("cpg_id", "created_at");

-- CreateIndex
CREATE INDEX "ml_predictions_model_version_idx" ON "ml_predictions"("model_version");

-- CreateIndex
CREATE INDEX "ml_predictions_created_at_idx" ON "ml_predictions"("created_at");

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_contractor_id_fkey" FOREIGN KEY ("contractor_id") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpgs" ADD CONSTRAINT "cpgs_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpgs" ADD CONSTRAINT "cpgs_renewed_from_id_fkey" FOREIGN KEY ("renewed_from_id") REFERENCES "cpgs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_cpg_id_fkey" FOREIGN KEY ("cpg_id") REFERENCES "cpgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_cpg_id_fkey" FOREIGN KEY ("cpg_id") REFERENCES "cpgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ml_predictions" ADD CONSTRAINT "ml_predictions_cpg_id_fkey" FOREIGN KEY ("cpg_id") REFERENCES "cpgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
