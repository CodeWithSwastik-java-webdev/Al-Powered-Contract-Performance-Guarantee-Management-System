// =============================================================================
// POWERGRID CPG Management System — Database Seed Script
// Idempotent: only inserts data if tables are empty.
// Run: npx prisma db seed  OR  npm run prisma:seed
// =============================================================================

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  return daysFromNow(-days);
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

async function seed() {
  console.log("🌱 Starting seed...\n");

  // =========================================================================
  // 1. Admin User
  // =========================================================================
  const existingUsers = await prisma.user.count();
  let adminUser;
  if (existingUsers === 0) {
    adminUser = await prisma.user.create({
      data: {
        firebaseUid: "seed-admin-uid-001",
        name: "Col. R.K. Sharma",
        email: "admin@powergrid.com",
        role: "ADMIN",
        department: "Contract & Procurement",
        phone: "+91-11-26000001",
        isActive: true,
      },
    });

    // Additional users
    await prisma.user.createMany({
      data: [
        {
          firebaseUid: "seed-engineer-uid-002",
          name: "Priya Verma",
          email: "priya.verma@powergrid.com",
          role: "ENGINEER",
          department: "Transmission Projects - NR",
          phone: "+91-11-26000002",
          isActive: true,
        },
        {
          firebaseUid: "seed-finance-uid-003",
          name: "Rajesh Kumar",
          email: "rajesh.kumar@powergrid.com",
          role: "FINANCE",
          department: "Finance & Accounts",
          phone: "+91-11-26000003",
          isActive: true,
        },
        {
          firebaseUid: "seed-viewer-uid-004",
          name: "Anita Singh",
          email: "anita.singh@powergrid.com",
          role: "VIEWER",
          department: "Corporate Planning",
          phone: "+91-11-26000004",
          isActive: true,
        },
      ],
    });
    console.log("  ✅ Created 4 users (admin + 3 staff)");
  } else {
    adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    console.log("  ⏭️  Users already exist, skipping");
  }

  // =========================================================================
  // 2. Contractors
  // =========================================================================
  const existingContractors = await prisma.contractor.count();
  if (existingContractors === 0) {
    await prisma.contractor.createMany({
      data: [
        {
          name: "Larsen & Toubro Limited",
          vendorCode: "LNT-001",
          gstNumber: "27AAACL0582E1Z3",
          panNumber: "AAACL0582E",
          contactPerson: "Vikram Patel",
          email: "vikram.patel@lnt.com",
          phone: "+91-22-67525656",
          address: "L&T House, Ballard Estate, Mumbai",
          state: "Maharashtra",
          rating: 4.7,
          isActive: true,
          isBlacklisted: false,
        },
        {
          name: "Bharat Heavy Electricals Limited",
          vendorCode: "BHEL-002",
          gstNumber: "09AAACB5765R1Z8",
          panNumber: "AAACB5765R",
          contactPerson: "Suresh Nair",
          email: "suresh.nair@bhel.in",
          phone: "+91-11-26001000",
          address: "BHEL House, Siri Fort, New Delhi",
          state: "Delhi",
          rating: 4.5,
          isActive: true,
          isBlacklisted: false,
        },
        {
          name: "Siemens India Limited",
          vendorCode: "SIEM-003",
          gstNumber: "27AAACS2362N1ZM",
          panNumber: "AAACS2362N",
          contactPerson: "Meera Joshi",
          email: "meera.joshi@siemens.com",
          phone: "+91-22-39677000",
          address: "Birla Aurora, Worli, Mumbai",
          state: "Maharashtra",
          rating: 4.8,
          isActive: true,
          isBlacklisted: false,
        },
        {
          name: "ABB India Limited",
          vendorCode: "ABB-004",
          gstNumber: "29AAACA8682K1ZN",
          panNumber: "AAACA8682K",
          contactPerson: "Deepak Reddy",
          email: "deepak.reddy@abb.com",
          phone: "+91-80-22949100",
          address: "Khanija Bhavan, Race Course Road, Bangalore",
          state: "Karnataka",
          rating: 4.3,
          isActive: true,
          isBlacklisted: false,
        },
        {
          name: "KEC International Limited",
          vendorCode: "KEC-005",
          gstNumber: "27AAACK3740H1ZO",
          panNumber: "AAACK3740H",
          contactPerson: "Amit Gupta",
          email: "amit.gupta@kec.com",
          phone: "+91-22-33055000",
          address: "RPG House, Worli, Mumbai",
          state: "Maharashtra",
          rating: 4.1,
          isActive: true,
          isBlacklisted: false,
        },
      ],
    });
    console.log("  ✅ Created 5 contractors");
  } else {
    console.log("  ⏭️  Contractors already exist, skipping");
  }

  // =========================================================================
  // 3. Contracts
  // =========================================================================
  const existingContracts = await prisma.contract.count();
  if (existingContracts === 0) {
    const contractors = await prisma.contractor.findMany();
    const cMap: Record<string, string> = {};
    for (const c of contractors) cMap[c.vendorCode] = c.id;

    const contractsData = [
      {
        contractNumber: "PGCIL/NR/TR/2024/001",
        projectName: "765kV Agra-Gwalior Transmission Line",
        description:
          "Design, supply, erection, testing, and commissioning of 765kV D/C Agra–Gwalior transmission line (approx. 180 km) including towers, conductors, and associated equipment.",
        contractValue: 245_00_00_000, // ₹245 Cr
        awardDate: daysAgo(540),
        completionDate: daysFromNow(180),
        status: "ACTIVE" as const,
        zone: "NR",
        contractorId: cMap["LNT-001"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/SR/SS/2024/002",
        projectName: "400kV GIS Substation Kurnool",
        description:
          "Construction of 400kV Gas Insulated Substation at Kurnool, Andhra Pradesh with 2x500 MVA ICTs and associated bay equipment.",
        contractValue: 189_00_00_000, // ₹189 Cr
        awardDate: daysAgo(420),
        completionDate: daysFromNow(300),
        status: "ACTIVE" as const,
        zone: "SR",
        contractorId: cMap["BHEL-002"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/WR/TR/2024/003",
        projectName: "400kV Boisar-Padghe Quad Line",
        description:
          "Supply, erection, and commissioning of 400kV Quad conductor transmission line from Boisar to Padghe (Maharashtra, ~95 km).",
        contractValue: 132_50_00_000, // ₹132.5 Cr
        awardDate: daysAgo(365),
        completionDate: daysFromNow(400),
        status: "ACTIVE" as const,
        zone: "WR",
        contractorId: cMap["SIEM-003"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/ER/SS/2024/004",
        projectName: "220kV AIS Substation Bokaro",
        description:
          "Establishment of 220kV Air Insulated Substation at Bokaro Steel City, Jharkhand, including 3x160 MVA transformers.",
        contractValue: 87_60_00_000, // ₹87.6 Cr
        awardDate: daysAgo(720),
        completionDate: daysAgo(30),
        status: "COMPLETED" as const,
        zone: "ER",
        contractorId: cMap["ABB-004"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/NR/TR/2024/005",
        projectName: "800kV HVDC Raigarh-Pugalur Line",
        description:
          "Construction of ±800kV HVDC bipole transmission line from Raigarh (Chhattisgarh) to Pugalur (Tamil Nadu), approximately 1,765 km.",
        contractValue: 1_250_00_00_000, // ₹1,250 Cr
        awardDate: daysAgo(900),
        completionDate: daysFromNow(600),
        status: "ACTIVE" as const,
        zone: "NR",
        contractorId: cMap["LNT-001"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/NER/TR/2024/006",
        projectName: "132kV Silchar-Aizawl Line",
        description:
          "Design and construction of 132kV S/C transmission line from Silchar (Assam) to Aizawl (Mizoram), ~200 km through hilly terrain.",
        contractValue: 56_00_00_000, // ₹56 Cr
        awardDate: daysAgo(300),
        completionDate: daysFromNow(500),
        status: "ACTIVE" as const,
        zone: "NER",
        contractorId: cMap["KEC-005"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/SR/STATCOM/2024/007",
        projectName: "STATCOM Installation at Tirunelveli",
        description:
          "Supply, installation, and commissioning of ±250 MVAR STATCOM at Tirunelveli 400kV substation for reactive power management.",
        contractValue: 315_00_00_000, // ₹315 Cr
        awardDate: daysAgo(180),
        completionDate: daysFromNow(720),
        status: "ACTIVE" as const,
        zone: "SR",
        contractorId: cMap["SIEM-003"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/WR/SS/2023/008",
        projectName: "765kV Jabalpur Substation Expansion",
        description:
          "Expansion of existing 765kV Jabalpur substation with 2 additional bays and 1x1500 MVA autotransformer.",
        contractValue: 98_00_00_000, // ₹98 Cr
        awardDate: daysAgo(1000),
        completionDate: daysAgo(90),
        status: "COMPLETED" as const,
        zone: "WR",
        contractorId: cMap["BHEL-002"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/NR/CABLE/2024/009",
        projectName: "400kV Underground Cable Delhi",
        description:
          "Supply and laying of 400kV XLPE underground cable circuit in Delhi NCR region (approx. 12 km).",
        contractValue: 420_00_00_000, // ₹420 Cr
        awardDate: daysAgo(60),
        completionDate: daysFromNow(900),
        status: "DRAFT" as const,
        zone: "NR",
        contractorId: cMap["ABB-004"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/ER/TR/2023/010",
        projectName: "400kV Ranchi-Dharamjaigarh Line",
        description:
          "Erection and commissioning of 400kV S/C transmission line from Ranchi to Dharamjaigarh (~310 km).",
        contractValue: 175_00_00_000, // ₹175 Cr
        awardDate: daysAgo(800),
        completionDate: daysAgo(150),
        status: "TERMINATED" as const,
        zone: "ER",
        contractorId: cMap["KEC-005"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/WR/SS/2024/011",
        projectName: "400kV Hybrid Substation Pune",
        description:
          "Construction of 400kV hybrid (GIS + AIS) substation at Pune with smart grid SCADA integration.",
        contractValue: 210_00_00_000, // ₹210 Cr
        awardDate: daysAgo(200),
        completionDate: daysFromNow(600),
        status: "ACTIVE" as const,
        zone: "WR",
        contractorId: cMap["LNT-001"],
        createdById: adminUser!.id,
      },
      {
        contractNumber: "PGCIL/SR/BESS/2024/012",
        projectName: "Battery Energy Storage System Chennai",
        description:
          "Installation of 100 MW/400 MWh grid-scale Battery Energy Storage System at Chennai 400kV substation.",
        contractValue: 580_00_00_000, // ₹580 Cr
        awardDate: daysAgo(90),
        completionDate: daysFromNow(800),
        status: "ACTIVE" as const,
        zone: "SR",
        contractorId: cMap["SIEM-003"],
        createdById: adminUser!.id,
      },
    ];

    for (const c of contractsData) {
      await prisma.contract.create({ data: c });
    }
    console.log("  ✅ Created 12 contracts");
  } else {
    console.log("  ⏭️  Contracts already exist, skipping");
  }

  // =========================================================================
  // 4. CPGs (Bank Guarantees)
  // =========================================================================
  const existingCpgs = await prisma.cpg.count();
  if (existingCpgs === 0) {
    const contracts = await prisma.contract.findMany({
      include: { contractor: true },
    });

    const cpgsData: Array<{
      contractId: string;
      bgNumber: string;
      bgType:
        | "PERFORMANCE_BANK_GUARANTEE"
        | "ADVANCE_BANK_GUARANTEE"
        | "SECURITY_DEPOSIT";
      bankName: string;
      bankBranch: string;
      ifscCode: string;
      amount: number;
      issueDate: Date;
      expiryDate: Date;
      claimPeriodEnd: Date;
      status:
        | "ACTIVE"
        | "REQUIRED"
        | "SUBMITTED"
        | "VERIFIED"
        | "EXPIRED"
        | "RELEASED"
        | "RENEWED";
      remarks?: string;
    }> = [];

    // Generate 2–3 CPGs per active/completed contract
    const banks = [
      {
        name: "State Bank of India",
        branch: "Parliament Street, New Delhi",
        ifsc: "SBIN0000691",
      },
      {
        name: "Punjab National Bank",
        branch: "Connaught Place, New Delhi",
        ifsc: "PUNB0015100",
      },
      {
        name: "Bank of Baroda",
        branch: "Baroda House, New Delhi",
        ifsc: "BARB0DBDELH",
      },
      {
        name: "Union Bank of India",
        branch: "Nariman Point, Mumbai",
        ifsc: "UBIN0530786",
      },
      {
        name: "Canara Bank",
        branch: "Rajaji Nagar, Bangalore",
        ifsc: "CNRB0000218",
      },
    ];

    let bgCounter = 1;
    for (const contract of contracts) {
      if (contract.status === "DRAFT" || contract.status === "TERMINATED")
        continue;

      // PBG for each contract
      const bank1 = banks[bgCounter % banks.length];
      cpgsData.push({
        contractId: contract.id,
        bgNumber: `BG/${new Date().getFullYear()}/${String(bgCounter++).padStart(4, "0")}`,
        bgType: "PERFORMANCE_BANK_GUARANTEE",
        bankName: bank1.name,
        bankBranch: bank1.branch,
        ifscCode: bank1.ifsc,
        amount:
          Number(contract.contractValue) * 0.1, // 10% of contract value
        issueDate: daysAgo(Math.floor(Math.random() * 300) + 100),
        expiryDate:
          contract.status === "COMPLETED"
            ? daysAgo(10)
            : daysFromNow(Math.floor(Math.random() * 200) + 30),
        claimPeriodEnd:
          contract.status === "COMPLETED"
            ? daysFromNow(60)
            : daysFromNow(Math.floor(Math.random() * 300) + 200),
        status:
          contract.status === "COMPLETED" ? "RELEASED" : "ACTIVE",
      });

      // ABG for bigger contracts (>₹100 Cr)
      if (Number(contract.contractValue) > 100_00_00_000) {
        const bank2 = banks[(bgCounter + 1) % banks.length];
        cpgsData.push({
          contractId: contract.id,
          bgNumber: `BG/${new Date().getFullYear()}/${String(bgCounter++).padStart(4, "0")}`,
          bgType: "ADVANCE_BANK_GUARANTEE",
          bankName: bank2.name,
          bankBranch: bank2.branch,
          ifscCode: bank2.ifsc,
          amount:
            Number(contract.contractValue) * 0.05, // 5% of contract value
          issueDate: daysAgo(Math.floor(Math.random() * 400) + 150),
          expiryDate: daysFromNow(Math.floor(Math.random() * 100) + 10),
          claimPeriodEnd: daysFromNow(Math.floor(Math.random() * 200) + 100),
          status: "ACTIVE",
        });
      }
    }

    // Add some in special statuses
    if (cpgsData.length > 3) {
      cpgsData[1].status = "VERIFIED";
      cpgsData[1].remarks = "Verified by Finance department on physical inspection.";
    }
    if (cpgsData.length > 5) {
      cpgsData[4].status = "SUBMITTED";
      cpgsData[4].remarks = "Awaiting verification from bank.";
    }
    if (cpgsData.length > 8) {
      cpgsData[7].status = "EXPIRED";
      cpgsData[7].expiryDate = daysAgo(15);
      cpgsData[7].remarks = "Expired — renewal pending.";
    }
    // One that expires soon (within 30 days) for dashboard alerts
    if (cpgsData.length > 2) {
      cpgsData[2].expiryDate = daysFromNow(18);
      cpgsData[2].remarks = "Expiring soon — contractor notified for extension.";
    }

    for (const cpg of cpgsData) {
      await prisma.cpg.create({ data: cpg });
    }
    console.log(`  ✅ Created ${cpgsData.length} CPGs`);
  } else {
    console.log("  ⏭️  CPGs already exist, skipping");
  }

  // =========================================================================
  // 5. Risk Assessments
  // =========================================================================
  const existingRisks = await prisma.riskAssessment.count();
  if (existingRisks === 0) {
    const cpgs = await prisma.cpg.findMany();
    const riskData = cpgs.map((cpg, i) => {
      const scores = [92.5, 85.0, 67.3, 45.0, 78.9, 55.2, 88.1, 30.5, 71.4, 96.0];
      const score = scores[i % scores.length];
      const level =
        score >= 80 ? "LOW" as const :
        score >= 60 ? "MEDIUM" as const :
        score >= 40 ? "HIGH" as const :
        "CRITICAL" as const;
      const anomaly = score < 50;

      return {
        cpgId: cpg.id,
        healthScore: score,
        riskLevel: level,
        anomalyDetected: anomaly,
        anomalyReason: anomaly
          ? "Unusual pattern detected: CPG amount significantly deviates from contract value norms."
          : null,
        factors: {
          daysToExpiry: Math.floor(Math.random() * 365),
          extensionCount: Math.floor(Math.random() * 3),
          amountToContractRatio: (Math.random() * 0.15 + 0.03).toFixed(4),
          documentCompleteness: Math.random() > 0.3 ? 1.0 : 0.6,
        },
        assessedBySystem: true,
      };
    });

    await prisma.riskAssessment.createMany({ data: riskData });
    console.log(`  ✅ Created ${riskData.length} risk assessments`);
  } else {
    console.log("  ⏭️  Risk assessments already exist, skipping");
  }

  // =========================================================================
  // 6. Notifications
  // =========================================================================
  const existingNotifs = await prisma.notification.count();
  if (existingNotifs === 0 && adminUser) {
    const cpgs = await prisma.cpg.findMany({ take: 5 });
    const notifData = [
      {
        userId: adminUser.id,
        type: "EXPIRY_ALERT" as const,
        title: "CPG Expiring in 18 Days",
        message: `Bank Guarantee ${cpgs[0]?.bgNumber ?? "BG/2025/0001"} is expiring within 30 days. Please initiate renewal or extension process.`,
        isRead: false,
        relatedEntityType: "CPG" as const,
        relatedEntityId: cpgs[0]?.id,
      },
      {
        userId: adminUser.id,
        type: "ANOMALY_DETECTED" as const,
        title: "Risk Anomaly Detected",
        message:
          "Unusual amount pattern detected for CPG linked to Ranchi-Dharamjaigarh Line contract. Health score dropped to 30.5.",
        isRead: false,
        relatedEntityType: "CPG" as const,
        relatedEntityId: cpgs[3]?.id,
      },
      {
        userId: adminUser.id,
        type: "STATUS_CHANGE" as const,
        title: "CPG Status Updated",
        message: `Bank Guarantee ${cpgs[1]?.bgNumber ?? "BG/2025/0002"} status changed from SUBMITTED to VERIFIED.`,
        isRead: true,
        readAt: daysAgo(2),
        relatedEntityType: "CPG" as const,
        relatedEntityId: cpgs[1]?.id,
      },
      {
        userId: adminUser.id,
        type: "SYSTEM" as const,
        title: "Welcome to CPG Management System",
        message:
          "Your account has been set up with Admin privileges. You can manage contracts, CPGs, and view AI-powered risk analytics.",
        isRead: true,
        readAt: daysAgo(30),
      },
      {
        userId: adminUser.id,
        type: "RISK_ESCALATION" as const,
        title: "Critical Risk Level Detected",
        message:
          "One or more CPGs have been flagged with CRITICAL risk level. Immediate review recommended.",
        isRead: false,
        relatedEntityType: "CPG" as const,
        relatedEntityId: cpgs[4]?.id,
      },
      {
        userId: adminUser.id,
        type: "REMINDER" as const,
        title: "Quarterly BG Audit Due",
        message:
          "Quarterly Bank Guarantee audit is due next week. Please ensure all physical BGs are verified against system records.",
        isRead: false,
      },
    ];

    await prisma.notification.createMany({ data: notifData });
    console.log("  ✅ Created 6 notifications");
  } else {
    console.log("  ⏭️  Notifications already exist, skipping");
  }

  // =========================================================================
  // 7. Audit Logs
  // =========================================================================
  const existingLogs = await prisma.auditLog.count();
  if (existingLogs === 0 && adminUser) {
    const contracts = await prisma.contract.findMany({ take: 4 });
    const cpgs = await prisma.cpg.findMany({ take: 4 });

    const auditData = [
      {
        userId: adminUser.id,
        entityType: "CONTRACT" as const,
        entityId: contracts[0]?.id ?? "unknown",
        action: "CREATE" as const,
        newValue: { contractNumber: "PGCIL/NR/TR/2024/001", status: "ACTIVE" },
        ipAddress: "10.0.0.1",
        userAgent: "Mozilla/5.0",
        createdAt: daysAgo(540),
      },
      {
        userId: adminUser.id,
        entityType: "CPG" as const,
        entityId: cpgs[0]?.id ?? "unknown",
        action: "CREATE" as const,
        newValue: { bgNumber: cpgs[0]?.bgNumber, status: "ACTIVE" },
        ipAddress: "10.0.0.1",
        userAgent: "Mozilla/5.0",
        createdAt: daysAgo(500),
      },
      {
        userId: adminUser.id,
        entityType: "CPG" as const,
        entityId: cpgs[1]?.id ?? "unknown",
        action: "STATUS_CHANGE" as const,
        oldValue: { status: "SUBMITTED" },
        newValue: { status: "VERIFIED" },
        ipAddress: "10.0.0.1",
        userAgent: "Mozilla/5.0",
        createdAt: daysAgo(30),
      },
      {
        userId: adminUser.id,
        entityType: "CONTRACT" as const,
        entityId: contracts[1]?.id ?? "unknown",
        action: "UPDATE" as const,
        oldValue: { status: "DRAFT" },
        newValue: { status: "ACTIVE" },
        ipAddress: "10.0.0.1",
        userAgent: "Mozilla/5.0",
        createdAt: daysAgo(400),
      },
      {
        userId: adminUser.id,
        entityType: "USER" as const,
        entityId: adminUser.id,
        action: "LOGIN" as const,
        metadata: { method: "firebase", browser: "Chrome" },
        ipAddress: "10.0.0.1",
        userAgent: "Mozilla/5.0",
        createdAt: daysAgo(1),
      },
      {
        userId: adminUser.id,
        entityType: "CPG" as const,
        entityId: cpgs[2]?.id ?? "unknown",
        action: "RENEWAL" as const,
        oldValue: { expiryDate: daysAgo(10).toISOString() },
        newValue: { expiryDate: daysFromNow(365).toISOString(), status: "RENEWED" },
        ipAddress: "10.0.0.1",
        userAgent: "Mozilla/5.0",
        createdAt: daysAgo(15),
      },
    ];

    for (const log of auditData) {
      await prisma.auditLog.create({ data: log });
    }
    console.log("  ✅ Created 6 audit logs");
  } else {
    console.log("  ⏭️  Audit logs already exist, skipping");
  }

  // =========================================================================
  // 8. Registration Requests & Comments
  // =========================================================================
  const existingReqs = await prisma.registrationRequest.count();
  if (existingReqs === 0 && adminUser) {
    const regReq1 = await prisma.registrationRequest.create({
      data: {
        category: "EMPLOYEE",
        status: "PENDING_APPROVAL",
        email: "ramesh.kumar@powergrid.com",
        name: "Ramesh Kumar",
        phone: "+91-9988776655",
        department: "Finance & Accounts",
        employeeId: "PG-EMP-2026-0045",
        currentStage: "Verification",
        estimatedReviewTime: "1 Working Day",
        formData: {
          step1: { name: "Ramesh Kumar", email: "ramesh.kumar@powergrid.com" },
          step2: { department: "Finance & Accounts", employeeId: "PG-EMP-2026-0045" }
        },
        uploadedDocs: [
          { name: "employee_id_card.pdf", url: "https://cloudinary.com/dummy/id.pdf", type: "ID_PROOF" }
        ]
      }
    });

    const regReq2 = await prisma.registrationRequest.create({
      data: {
        category: "CONTRACTOR",
        status: "MORE_INFORMATION_REQUIRED",
        email: "contact@relianceinfra.com",
        name: "Reliance Infrastructure Ltd",
        phone: "+91-22-30303030",
        companyName: "Reliance Infrastructure Ltd",
        vendorCode: "REL-INF-003",
        gstNumber: "27AAACR1234F1Z5",
        panNumber: "AAACR1234F",
        contactPerson: "Sanjay Mehta",
        companyAddress: "Reliance Centre, Santacruz East, Mumbai",
        companyState: "Maharashtra",
        currentStage: "Document Review",
        estimatedReviewTime: "2 Working Days",
        formData: {
          step1: { companyName: "Reliance Infrastructure Ltd", vendorCode: "REL-INF-003" },
          step2: { contactPerson: "Sanjay Mehta", email: "contact@relianceinfra.com" }
        },
        uploadedDocs: [
          { name: "gst_certificate.pdf", url: "https://cloudinary.com/dummy/gst.pdf", type: "BUSINESS_DOC" }
        ]
      }
    });

    // Add comments
    await prisma.registrationComment.create({
      data: {
        requestId: regReq2.id,
        authorId: adminUser.id,
        content: "GST certificate is blurry. Please upload a clear high-resolution scanned copy."
      }
    });

    console.log("  ✅ Created 2 registration requests and 1 comment");
  } else {
    console.log("  ⏭️  Registration requests already exist, skipping");
  }

  // =========================================================================
  // 9. Login Activities
  // =========================================================================
  const existingLoginActivities = await prisma.loginActivity.count();
  if (existingLoginActivities === 0 && adminUser) {
    await prisma.loginActivity.createMany({
      data: [
        {
          userId: adminUser.id,
          email: adminUser.email,
          ipAddress: "192.168.1.10",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          browser: "Chrome",
          device: "Desktop",
          location: "New Delhi, India",
          loginTime: daysAgo(2),
          logoutTime: daysAgo(2),
          isSuccessful: true
        },
        {
          userId: adminUser.id,
          email: adminUser.email,
          ipAddress: "192.168.1.15",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
          browser: "Safari",
          device: "Mobile",
          location: "Gurugram, India",
          loginTime: daysAgo(1),
          isSuccessful: true
        },
        {
          email: "unknown_user@powergrid.com",
          ipAddress: "203.0.113.5",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
          browser: "Chrome",
          device: "Desktop",
          location: "Mumbai, India",
          loginTime: daysAgo(3),
          isSuccessful: false,
          failureReason: "Invalid Firebase ID token"
        }
      ]
    });
    console.log("  ✅ Created 3 login activities");
  }

  // =========================================================================
  // 10. Report History
  // =========================================================================
  const existingReports = await prisma.reportHistory.count();
  if (existingReports === 0 && adminUser) {
    await prisma.reportHistory.createMany({
      data: [
        {
          reportName: "Q2-Contract-Performance-Status-Report.pdf",
          generatedById: adminUser.id,
          generatedOn: daysAgo(15),
          downloaded: true,
          shared: false,
          fileUrl: "https://cloudinary.com/dummy/q2_report.pdf"
        },
        {
          reportName: "Expiry-Risk-Analysis-Dashboard-June.xlsx",
          generatedById: adminUser.id,
          generatedOn: daysAgo(5),
          downloaded: false,
          shared: true,
          fileUrl: "https://cloudinary.com/dummy/june_risk.xlsx"
        }
      ]
    });
    console.log("  ✅ Created 2 reports history records");
  }

  console.log("\n🎉 Seed complete!\n");
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
