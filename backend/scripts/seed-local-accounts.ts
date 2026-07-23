import "dotenv/config";
import { prisma, disconnectDatabase } from "../src/prisma/client";
import { hashPassword } from "../src/utils";

const accounts = [
  { email: "admin@powergrid.com", password: "Admin@2026", name: "POWERGRID Administrator", role: "ADMIN" as const, department: "Administration" },
  { email: "employee@powergrid.com", password: "Employee@2026", name: "POWERGRID Employee", role: "ENGINEER" as const, department: "Transmission Projects" },
  { email: "contractor@powergrid.com", password: "Contractor@2026", name: "Contractor Portal User", role: "VIEWER" as const, department: "Contractor" },
  { email: "finance@powergrid.com", password: "Finance@2026", name: "Finance Officer", role: "FINANCE" as const, department: "Finance & Accounts" },
  { email: "viewer@powergrid.com", password: "Viewer@2026", name: "Read-only Viewer", role: "VIEWER" as const, department: "Corporate Planning" },
];
async function main() {
  for (const account of accounts) {
    const passwordHash = await hashPassword(account.password);
    await prisma.user.upsert({ where: { email: account.email }, update: { passwordHash, name: account.name, role: account.role, department: account.department, status: "ACTIVE", isActive: true }, create: { authIdentifier: `local:${account.email}`, passwordHash, name: account.name, email: account.email, role: account.role, department: account.department, status: "ACTIVE", isActive: true } });
    console.log(`Created/updated ${account.role}: ${account.email}`);
  }
}
main().then(() => disconnectDatabase()).catch(async (error) => { console.error(error); await disconnectDatabase(); process.exit(1); });
