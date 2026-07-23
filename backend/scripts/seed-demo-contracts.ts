/**
 * Seeds Railway/local DB with demo contractors, 10 contracts, CPGs, risk, and activity.
 * Idempotent on contract numbers / vendor codes / BG numbers.
 * Run: npm run seed:contracts
 */
import "dotenv/config";
import { prisma, disconnectDatabase } from "../src/prisma/client";

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  return daysFromNow(-days);
}

const contractorsSeed = [
  {
    vendorCode: "LNT-001",
    name: "Larsen & Toubro Limited",
    gstNumber: "27AAACL0582E1Z3",
    panNumber: "AAACL0582E",
    contactPerson: "Vikram Patel",
    email: "vikram.patel@lnt.com",
    phone: "+91-22-67525656",
    address: "L&T House, Ballard Estate, Mumbai",
    state: "Maharashtra",
    rating: 4.7,
  },
  {
    vendorCode: "BHEL-002",
    name: "Bharat Heavy Electricals Limited",
    gstNumber: "09AAACB5765R1Z8",
    panNumber: "AAACB5765R",
    contactPerson: "Suresh Nair",
    email: "suresh.nair@bhel.in",
    phone: "+91-11-26001000",
    address: "BHEL House, Siri Fort, New Delhi",
    state: "Delhi",
    rating: 4.5,
  },
  {
    vendorCode: "SIEM-003",
    name: "Siemens India Limited",
    gstNumber: "27AAACS2362N1ZM",
    panNumber: "AAACS2362N",
    contactPerson: "Meera Joshi",
    email: "meera.joshi@siemens.com",
    phone: "+91-22-39677000",
    address: "Birla Aurora, Worli, Mumbai",
    state: "Maharashtra",
    rating: 4.8,
  },
  {
    vendorCode: "ABB-004",
    name: "ABB India Limited",
    gstNumber: "29AAACA8682K1ZN",
    panNumber: "AAACA8682K",
    contactPerson: "Deepak Reddy",
    email: "deepak.reddy@abb.com",
    phone: "+91-80-22949100",
    address: "Khanija Bhavan, Race Course Road, Bangalore",
    state: "Karnataka",
    rating: 4.3,
  },
  {
    vendorCode: "KEC-005",
    name: "KEC International Limited",
    gstNumber: "27AAACK3740H1ZO",
    panNumber: "AAACK3740H",
    contactPerson: "Amit Gupta",
    email: "amit.gupta@kec.com",
    phone: "+91-22-33055000",
    address: "RPG House, Worli, Mumbai",
    state: "Maharashtra",
    rating: 4.1,
  },
];

const banks = [
  { name: "State Bank of India", branch: "Parliament Street, New Delhi", ifsc: "SBIN0000691" },
  { name: "Punjab National Bank", branch: "Connaught Place, New Delhi", ifsc: "PUNB0015100" },
  { name: "Bank of Baroda", branch: "Baroda House, New Delhi", ifsc: "BARB0DBDELH" },
  { name: "Union Bank of India", branch: "Nariman Point, Mumbai", ifsc: "UBIN0530786" },
  { name: "Canara Bank", branch: "Rajaji Nagar, Bangalore", ifsc: "CNRB0000218" },
];

type ContractSeed = {
  contractNumber: string;
  projectName: string;
  description: string;
  contractValue: number;
  awardDate: Date;
  completionDate: Date;
  status: "ACTIVE" | "COMPLETED" | "DRAFT" | "TERMINATED" | "SUSPENDED";
  zone: string;
  vendorCode: string;
};

const contractsSeed: ContractSeed[] = [
  {
    contractNumber: "PGCIL/NR/TR/2024/001",
    projectName: "765kV Agra-Gwalior Transmission Line",
    description:
      "Design, supply, erection, testing, and commissioning of 765kV D/C Agra–Gwalior transmission line (approx. 180 km).",
    contractValue: 2_450_000_000,
    awardDate: daysAgo(540),
    completionDate: daysFromNow(180),
    status: "ACTIVE",
    zone: "NR",
    vendorCode: "LNT-001",
  },
  {
    contractNumber: "PGCIL/SR/SS/2024/002",
    projectName: "400kV GIS Substation Kurnool",
    description:
      "Construction of 400kV Gas Insulated Substation at Kurnool with 2x500 MVA ICTs and associated bay equipment.",
    contractValue: 1_890_000_000,
    awardDate: daysAgo(420),
    completionDate: daysFromNow(300),
    status: "ACTIVE",
    zone: "SR",
    vendorCode: "BHEL-002",
  },
  {
    contractNumber: "PGCIL/WR/TR/2024/003",
    projectName: "400kV Boisar-Padghe Quad Line",
    description:
      "Supply, erection, and commissioning of 400kV Quad conductor transmission line from Boisar to Padghe (~95 km).",
    contractValue: 1_325_000_000,
    awardDate: daysAgo(365),
    completionDate: daysFromNow(400),
    status: "ACTIVE",
    zone: "WR",
    vendorCode: "SIEM-003",
  },
  {
    contractNumber: "PGCIL/ER/SS/2024/004",
    projectName: "220kV AIS Substation Bokaro",
    description:
      "Establishment of 220kV Air Insulated Substation at Bokaro Steel City including 3x160 MVA transformers.",
    contractValue: 876_000_000,
    awardDate: daysAgo(720),
    completionDate: daysAgo(30),
    status: "COMPLETED",
    zone: "ER",
    vendorCode: "ABB-004",
  },
  {
    contractNumber: "PGCIL/NR/TR/2024/005",
    projectName: "800kV HVDC Raigarh-Pugalur Line",
    description:
      "Construction of ±800kV HVDC bipole transmission line from Raigarh to Pugalur, approximately 1,765 km.",
    contractValue: 12_500_000_000,
    awardDate: daysAgo(900),
    completionDate: daysFromNow(600),
    status: "ACTIVE",
    zone: "NR",
    vendorCode: "LNT-001",
  },
  {
    contractNumber: "PGCIL/NER/TR/2024/006",
    projectName: "132kV Silchar-Aizawl Line",
    description:
      "Design and construction of 132kV S/C transmission line from Silchar to Aizawl (~200 km through hilly terrain).",
    contractValue: 560_000_000,
    awardDate: daysAgo(300),
    completionDate: daysFromNow(500),
    status: "ACTIVE",
    zone: "NER",
    vendorCode: "KEC-005",
  },
  {
    contractNumber: "PGCIL/SR/STATCOM/2024/007",
    projectName: "STATCOM Installation at Tirunelveli",
    description:
      "Supply, installation, and commissioning of ±250 MVAR STATCOM at Tirunelveli 400kV substation.",
    contractValue: 3_150_000_000,
    awardDate: daysAgo(180),
    completionDate: daysFromNow(720),
    status: "ACTIVE",
    zone: "SR",
    vendorCode: "SIEM-003",
  },
  {
    contractNumber: "PGCIL/WR/SS/2024/011",
    projectName: "400kV Hybrid Substation Pune",
    description:
      "Construction of 400kV hybrid (GIS + AIS) substation at Pune with smart grid SCADA integration.",
    contractValue: 2_100_000_000,
    awardDate: daysAgo(200),
    completionDate: daysFromNow(600),
    status: "ACTIVE",
    zone: "WR",
    vendorCode: "LNT-001",
  },
  {
    contractNumber: "PGCIL/SR/BESS/2024/012",
    projectName: "Battery Energy Storage System Chennai",
    description:
      "Installation of 100 MW/400 MWh grid-scale Battery Energy Storage System at Chennai 400kV substation.",
    contractValue: 5_800_000_000,
    awardDate: daysAgo(90),
    completionDate: daysFromNow(800),
    status: "ACTIVE",
    zone: "SR",
    vendorCode: "SIEM-003",
  },
  {
    contractNumber: "PGCIL/NR/CABLE/2024/009",
    projectName: "400kV Underground Cable Delhi",
    description:
      "Supply and laying of 400kV XLPE underground cable circuit in Delhi NCR region (approx. 12 km).",
    contractValue: 4_200_000_000,
    awardDate: daysAgo(60),
    completionDate: daysFromNow(900),
    status: "ACTIVE",
    zone: "NR",
    vendorCode: "ABB-004",
  },
];

async function main() {
  const admin =
    (await prisma.user.findFirst({ where: { email: "admin@powergrid.com" } })) ??
    (await prisma.user.findFirst({ where: { role: "ADMIN" } }));

  if (!admin) {
    throw new Error("No admin user found. Run npm run seed:accounts first.");
  }

  const vendorToId = new Map<string, string>();
  for (const c of contractorsSeed) {
    const row = await prisma.contractor.upsert({
      where: { vendorCode: c.vendorCode },
      update: {
        name: c.name,
        contactPerson: c.contactPerson,
        email: c.email,
        phone: c.phone,
        address: c.address,
        state: c.state,
        gstNumber: c.gstNumber,
        panNumber: c.panNumber,
        rating: c.rating,
        isActive: true,
        isBlacklisted: false,
      },
      create: {
        ...c,
        isActive: true,
        isBlacklisted: false,
      },
    });
    vendorToId.set(c.vendorCode, row.id);
    console.log(`Contractor: ${row.vendorCode} — ${row.name}`);
  }

  let bgCounter = 1;
  for (const [index, seed] of contractsSeed.entries()) {
    const contractorId = vendorToId.get(seed.vendorCode);
    if (!contractorId) throw new Error(`Missing contractor ${seed.vendorCode}`);

    const contract = await prisma.contract.upsert({
      where: { contractNumber: seed.contractNumber },
      update: {
        projectName: seed.projectName,
        description: seed.description,
        contractValue: seed.contractValue,
        awardDate: seed.awardDate,
        completionDate: seed.completionDate,
        status: seed.status,
        zone: seed.zone,
        contractorId,
        createdById: admin.id,
        isDeleted: false,
      },
      create: {
        contractNumber: seed.contractNumber,
        projectName: seed.projectName,
        description: seed.description,
        contractValue: seed.contractValue,
        currency: "INR",
        awardDate: seed.awardDate,
        completionDate: seed.completionDate,
        status: seed.status,
        zone: seed.zone,
        contractorId,
        createdById: admin.id,
      },
    });
    console.log(`Contract: ${contract.contractNumber} [${contract.status}]`);

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        entityType: "CONTRACT",
        entityId: contract.id,
        action: "CREATE",
        newValue: {
          contractNumber: contract.contractNumber,
          projectName: contract.projectName,
          status: contract.status,
        },
        ipAddress: "127.0.0.1",
        userAgent: "seed-demo-contracts",
      },
    });

    if (seed.status === "DRAFT" || seed.status === "TERMINATED") continue;

    const bank = banks[index % banks.length]!;
    const pbgAmount = Math.round(Number(seed.contractValue) * 0.1);
    const bgNumber = `BG/PGCIL/2024/${String(bgCounter).padStart(4, "0")}`;
    bgCounter += 1;

    const expiryOffset = 30 + (index % 5) * 45;
    const issueDate = daysAgo(Math.max(30, 500 - index * 40));
    const expiryDate = daysFromNow(expiryOffset);
    const claimPeriodEnd = daysFromNow(expiryOffset + 180);

    const cpgStatuses = ["ACTIVE", "ACTIVE", "ACTIVE", "VERIFIED", "SUBMITTED"] as const;
    const cpgStatus = cpgStatuses[index % cpgStatuses.length]!;

    const cpg = await prisma.cpg.upsert({
      where: { bgNumber },
      update: {
        contractId: contract.id,
        bgType: "PERFORMANCE_BANK_GUARANTEE",
        bankName: bank.name,
        bankBranch: bank.branch,
        ifscCode: bank.ifsc,
        amount: pbgAmount,
        issueDate,
        expiryDate,
        claimPeriodEnd,
        status: cpgStatus,
        remarks: `PBG for ${seed.contractNumber}`,
        isDeleted: false,
      },
      create: {
        contractId: contract.id,
        bgNumber,
        bgType: "PERFORMANCE_BANK_GUARANTEE",
        bankName: bank.name,
        bankBranch: bank.branch,
        ifscCode: bank.ifsc,
        amount: pbgAmount,
        issueDate,
        expiryDate,
        claimPeriodEnd,
        status: cpgStatus,
        remarks: `PBG for ${seed.contractNumber}`,
      },
    });
    console.log(`  CPG: ${cpg.bgNumber} (${cpg.status})`);

    // Second BG for larger projects
    if (seed.contractValue >= 2_000_000_000) {
      const abgNumber = `BG/PGCIL/2024/${String(bgCounter).padStart(4, "0")}`;
      bgCounter += 1;
      const abgBank = banks[(index + 2) % banks.length]!;
      await prisma.cpg.upsert({
        where: { bgNumber: abgNumber },
        update: {
          contractId: contract.id,
          bgType: "ADVANCE_BANK_GUARANTEE",
          bankName: abgBank.name,
          bankBranch: abgBank.branch,
          ifscCode: abgBank.ifsc,
          amount: Math.round(pbgAmount * 0.5),
          issueDate,
          expiryDate: daysFromNow(expiryOffset + 90),
          claimPeriodEnd: daysFromNow(expiryOffset + 270),
          status: "ACTIVE",
          remarks: `ABG for ${seed.contractNumber}`,
          isDeleted: false,
        },
        create: {
          contractId: contract.id,
          bgNumber: abgNumber,
          bgType: "ADVANCE_BANK_GUARANTEE",
          bankName: abgBank.name,
          bankBranch: abgBank.branch,
          ifscCode: abgBank.ifsc,
          amount: Math.round(pbgAmount * 0.5),
          issueDate,
          expiryDate: daysFromNow(expiryOffset + 90),
          claimPeriodEnd: daysFromNow(expiryOffset + 270),
          status: "ACTIVE",
          remarks: `ABG for ${seed.contractNumber}`,
        },
      });
      console.log(`  CPG: ${abgNumber} (ACTIVE ABG)`);
    }

    const riskProfiles = [
      { healthScore: 92, riskLevel: "LOW" as const, anomalyDetected: false },
      { healthScore: 78, riskLevel: "MEDIUM" as const, anomalyDetected: false },
      { healthScore: 61, riskLevel: "HIGH" as const, anomalyDetected: true, anomalyReason: "Expiry within claim window with high exposure" },
      { healthScore: 88, riskLevel: "LOW" as const, anomalyDetected: false },
      { healthScore: 45, riskLevel: "CRITICAL" as const, anomalyDetected: true, anomalyReason: "Repeated claim-period proximity alerts" },
    ];
    const risk = riskProfiles[index % riskProfiles.length]!;

    const existingRisk = await prisma.riskAssessment.findFirst({
      where: { cpgId: cpg.id },
      orderBy: { createdAt: "desc" },
    });
    if (!existingRisk) {
      await prisma.riskAssessment.create({
        data: {
          cpgId: cpg.id,
          healthScore: risk.healthScore,
          riskLevel: risk.riskLevel,
          anomalyDetected: risk.anomalyDetected,
          anomalyReason: risk.anomalyReason,
          assessedBySystem: true,
          factors: {
            timeToExpiryDays: expiryOffset,
            exposureRatio: 0.1,
            contractorRating: 4.5,
          },
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        entityType: "CPG",
        entityId: cpg.id,
        action: "CREATE",
        newValue: { bgNumber: cpg.bgNumber, status: cpg.status, amount: pbgAmount },
        ipAddress: "127.0.0.1",
        userAgent: "seed-demo-contracts",
      },
    });
  }

  const counts = await Promise.all([
    prisma.contractor.count(),
    prisma.contract.count(),
    prisma.cpg.count(),
    prisma.riskAssessment.count(),
    prisma.auditLog.count(),
  ]);
  console.log("\nDone.");
  console.log(`Contractors: ${counts[0]}, Contracts: ${counts[1]}, CPGs: ${counts[2]}, Risks: ${counts[3]}, Audit logs: ${counts[4]}`);
}

main()
  .then(() => disconnectDatabase())
  .catch(async (error) => {
    console.error(error);
    await disconnectDatabase();
    process.exit(1);
  });
