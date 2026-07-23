/**
 * Applies RBAC role enum expansion + contractor_id on Railway.
 * Prisma migrate cannot safely ADD VALUE + remap in one transaction.
 */
import "dotenv/config";
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const addValues = [
    "PROJECT_ENGINEER",
    "FINANCE_OFFICER",
    "CONTRACT_MANAGER",
    "AUDITOR",
    "CONTRACTOR",
  ];

  for (const value of addValues) {
    await client.query(`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS '${value}'`);
    console.log(`Ensured enum value: ${value}`);
  }

  // New enum values must be committed before use — reconnect if needed
  await client.query("COMMIT").catch(() => undefined);

  await client.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "contractor_id" TEXT`);
  await client.query(`UPDATE "users" SET "role" = 'PROJECT_ENGINEER' WHERE "role"::text = 'ENGINEER'`);
  await client.query(`UPDATE "users" SET "role" = 'FINANCE_OFFICER' WHERE "role"::text = 'FINANCE'`);
  await client.query(`CREATE INDEX IF NOT EXISTS "users_contractor_id_idx" ON "users"("contractor_id")`);

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_contractor_id_fkey') THEN
        ALTER TABLE "users"
          ADD CONSTRAINT "users_contractor_id_fkey"
          FOREIGN KEY ("contractor_id") REFERENCES "contractors"("id")
          ON DELETE SET NULL ON UPDATE CASCADE;
      END IF;
    END $$;
  `);

  // Recreate enum without ENGINEER/FINANCE so Prisma schema matches
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole_new') THEN
        DROP TYPE "UserRole_new";
      END IF;
    END $$;
  `);

  await client.query(`
    CREATE TYPE "UserRole_new" AS ENUM (
      'ADMIN',
      'PROJECT_ENGINEER',
      'FINANCE_OFFICER',
      'CONTRACT_MANAGER',
      'AUDITOR',
      'CONTRACTOR',
      'VIEWER'
    )
  `);

  await client.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
  await client.query(`
    ALTER TABLE "users"
      ALTER COLUMN "role" TYPE "UserRole_new"
      USING (
        CASE "role"::text
          WHEN 'ENGINEER' THEN 'PROJECT_ENGINEER'
          WHEN 'FINANCE' THEN 'FINANCE_OFFICER'
          ELSE "role"::text
        END
      )::"UserRole_new"
  `);
  await client.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'VIEWER'::"UserRole_new"`);
  await client.query(`DROP TYPE "UserRole"`);
  await client.query(`ALTER TYPE "UserRole_new" RENAME TO "UserRole"`);

  console.log("RBAC roles applied successfully");
  await client.end();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
