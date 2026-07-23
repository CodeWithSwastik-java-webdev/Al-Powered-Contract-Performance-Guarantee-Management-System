import "dotenv/config";
import { prisma, disconnectDatabase } from "../src/prisma/client";
import { hashPassword } from "../src/utils";

const accounts = [
  {
    email: "admin@powergrid.com",
    password: "Admin@2026",
    name: "POWERGRID Administrator",
    role: "ADMIN" as const,
    department: "Administration",
  },
  {
    email: "employee@powergrid.com",
    password: "Employee@2026",
    name: "Project Engineer",
    role: "PROJECT_ENGINEER" as const,
    department: "Transmission Projects",
  },
  {
    email: "finance@powergrid.com",
    password: "Finance@2026",
    name: "Finance Officer",
    role: "FINANCE_OFFICER" as const,
    department: "Finance & Accounts",
  },
  {
    email: "manager@powergrid.com",
    password: "Manager@2026",
    name: "Contract Manager",
    role: "CONTRACT_MANAGER" as const,
    department: "Contract Management",
  },
  {
    email: "auditor@powergrid.com",
    password: "Auditor@2026",
    name: "Internal Auditor",
    role: "AUDITOR" as const,
    department: "Internal Audit",
  },
  {
    email: "contractor@powergrid.com",
    password: "Contractor@2026",
    name: "Contractor Portal User",
    role: "CONTRACTOR" as const,
    department: "Contractor",
    linkContractorVendorCode: "LNT-001",
  },
  {
    email: "viewer@powergrid.com",
    password: "Viewer@2026",
    name: "Read-only Viewer",
    role: "VIEWER" as const,
    department: "Corporate Planning",
  },
];

async function main() {
  for (const account of accounts) {
    const passwordHash = await hashPassword(account.password);
    let contractorId: string | undefined;

    if ("linkContractorVendorCode" in account && account.linkContractorVendorCode) {
      const contractor = await prisma.contractor.findUnique({
        where: { vendorCode: account.linkContractorVendorCode },
      });
      if (!contractor) {
        throw new Error(
          `Contractor ${account.linkContractorVendorCode} not found. Run npm run seed:contracts first.`,
        );
      }
      contractorId = contractor.id;
    }

    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        passwordHash,
        name: account.name,
        role: account.role,
        department: account.department,
        status: "ACTIVE",
        isActive: true,
        ...(contractorId ? { contractorId } : { contractorId: null }),
      },
      create: {
        authIdentifier: `local:${account.email}`,
        passwordHash,
        name: account.name,
        email: account.email,
        role: account.role,
        department: account.department,
        status: "ACTIVE",
        isActive: true,
        ...(contractorId ? { contractorId } : {}),
      },
    });
    console.log(`Created/updated ${account.role}: ${account.email}`);
  }
}

main()
  .then(() => disconnectDatabase())
  .catch(async (error) => {
    console.error(error);
    await disconnectDatabase();
    process.exit(1);
  });
