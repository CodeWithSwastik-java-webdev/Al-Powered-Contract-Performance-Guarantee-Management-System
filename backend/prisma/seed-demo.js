const dotenv = require('dotenv')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../src/generated/prisma/client')

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for seeding')
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function daysFromNow(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

function daysAgo(days) {
  return daysFromNow(-days)
}

function deriveRiskLevel(score) {
  if (score >= 80) return 'LOW'
  if (score >= 60) return 'MEDIUM'
  if (score >= 40) return 'HIGH'
  return 'CRITICAL'
}

async function seedDemoData() {
  console.log('🌱 Seeding 10 demo rows per major table...\n')

  const users = Array.from({ length: 10 }, (_, index) => {
    const sequence = String(index + 1).padStart(4, '0')
    const roles = ['ADMIN', 'ENGINEER', 'FINANCE', 'VIEWER']
    const departments = [
      'Contract & Procurement',
      'Transmission Projects',
      'Finance & Accounts',
      'Corporate Planning',
    ]

    return {
      id: `demo-user-${index + 1}`,
      firebaseUid: `demo-firebase-uid-${index + 1}`,
      name:
        index === 0
          ? 'Col. R.K. Sharma'
          : [`Priya Verma`, `Rajesh Kumar`, `Anita Singh`, `Aman Gupta`, `Neha Rao`, `Sanjay Mehta`, `Deepa Nair`, `Vivek Bansal`, `Pooja Joshi`][index - 1],
      email:
        index === 0
          ? 'admin@powergrid.com'
          : [`priya.verma@powergrid.com`, `rajesh.kumar@powergrid.com`, `anita.singh@powergrid.com`, `aman.gupta@powergrid.com`, `neha.rao@powergrid.com`, `sanjay.mehta@powergrid.com`, `deepa.nair@powergrid.com`, `vivek.bansal@powergrid.com`, `pooja.joshi@powergrid.com`][index - 1],
      role: roles[index % roles.length],
      department: departments[index % departments.length],
      phone: `+91-11-2600${String(index + 1).padStart(4, '0')}`,
      isActive: true,
      status: 'ACTIVE',
      employeeId: `PG-EMP-2026-${sequence}`,
      failedLoginAttempts: 0,
      lockedUntil: null,
      isDeleted: false,
    }
  })

  await prisma.user.createMany({ data: users, skipDuplicates: true })
  const adminUser = await prisma.user.findUnique({ where: { id: 'demo-user-1' } })
  if (!adminUser) {
    throw new Error('Failed to create demo admin user')
  }

  const contractors = Array.from({ length: 10 }, (_, index) => {
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat']
    const names = [
      'Larsen & Toubro Limited',
      'Bharat Heavy Electricals Limited',
      'Siemens India Limited',
      'ABB India Limited',
      'KEC International Limited',
      'Tata Projects Limited',
      'Sterlite Power Transmission Limited',
      'Kalpataru Projects International Limited',
      'Jyoti Structures Limited',
      'Techno Electric & Engineering Co. Ltd.',
    ]

    return {
      id: `demo-contractor-${index + 1}`,
      name: names[index],
      vendorCode: `VND-${String(index + 1).padStart(3, '0')}`,
      gstNumber: `27AAACD${String(1000 + index)}Z1Z`,
      panNumber: `AAACD${String(1000 + index)}Z`,
      contactPerson: [`Vikram Patel`, `Suresh Nair`, `Meera Joshi`, `Deepak Reddy`, `Amit Gupta`, `Rohit Kulkarni`, `Anjali Desai`, `Karan Malhotra`, `Sunita Sharma`, `Harish Mehta`][index],
      email: `vendor${index + 1}@powergrid-demo.com`,
      phone: `+91-22-6752${String(5600 + index)}`,
      address: `${index + 1} Demo Industrial Estate, Sector ${10 + index}, Mumbai`,
      state: states[index % states.length],
      rating: Number((4.1 + (index % 5) * 0.15).toFixed(2)),
      isActive: true,
      isBlacklisted: false,
    }
  })

  await prisma.contractor.createMany({ data: contractors, skipDuplicates: true })

  const contractStatuses = [
    'ACTIVE',
    'ACTIVE',
    'COMPLETED',
    'SUSPENDED',
    'TERMINATED',
    'ACTIVE',
    'ACTIVE',
    'COMPLETED',
    'DRAFT',
    'ACTIVE',
  ]

  const zones = ['NR', 'SR', 'WR', 'ER', 'NER']
  const contractKinds = [
    '765kV Transmission Line',
    '400kV GIS Substation',
    '220kV AIS Substation',
    '400kV Quad Line',
    '400kV HVDC Corridor',
    '132kV Line Upgrade',
    'STATCOM Installation',
    'Substation Expansion',
    'Underground Cable Package',
    'Battery Storage System',
  ]

  const contracts = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-contract-${index + 1}`,
    contractNumber: `PGCIL/${zones[index % zones.length]}/TR/2026/${String(index + 1).padStart(3, '0')}`,
    projectName: `${contractKinds[index]} - Demo Project ${index + 1}`,
    description: `Demo contract ${index + 1} for the POWERGRID CPG portal. This record is seeded for UI validation, dashboards, and reports.`,
    contractValue: 50_00_00_000 + index * 12_50_00_000,
    currency: 'INR',
    awardDate: daysAgo(450 - index * 20),
    completionDate: index === 8 ? null : daysFromNow(90 + index * 40),
    status: contractStatuses[index],
    zone: zones[index % zones.length],
    isDeleted: false,
    contractorId: contractors[index].id,
    createdById: adminUser.id,
    updatedById: adminUser.id,
  }))

  await prisma.contract.createMany({ data: contracts, skipDuplicates: true })

  const cpgStatuses = [
    'ACTIVE',
    'SUBMITTED',
    'VERIFIED',
    'ACTIVE',
    'RELEASED',
    'EXPIRED',
    'RENEWED',
    'REQUIRED',
    'CLAIMED',
    'INVOKED',
  ]

  const banks = [
    { name: 'State Bank of India', branch: 'Parliament Street, New Delhi', ifsc: 'SBIN0000691' },
    { name: 'Punjab National Bank', branch: 'Connaught Place, New Delhi', ifsc: 'PUNB0015100' },
    { name: 'Bank of Baroda', branch: 'Baroda House, New Delhi', ifsc: 'BARB0DBDELH' },
    { name: 'Union Bank of India', branch: 'Nariman Point, Mumbai', ifsc: 'UBIN0530786' },
    { name: 'Canara Bank', branch: 'Rajaji Nagar, Bangalore', ifsc: 'CNRB0000218' },
  ]

  const cpgs = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-cpg-${index + 1}`,
    contractId: contracts[index].id,
    bgNumber: `BG/2026/${String(index + 1).padStart(4, '0')}`,
    bgType: index % 3 === 1 ? 'ADVANCE_BANK_GUARANTEE' : 'PERFORMANCE_BANK_GUARANTEE',
    bankName: banks[index % banks.length].name,
    bankBranch: banks[index % banks.length].branch,
    ifscCode: banks[index % banks.length].ifsc,
    amount: Number(contracts[index].contractValue) * (index % 3 === 1 ? 0.05 : 0.1),
    issueDate: daysAgo(300 - index * 15),
    expiryDate: index === 5 ? daysAgo(12) : daysFromNow(120 + index * 25),
    claimPeriodEnd: index === 5 ? daysFromNow(45) : daysFromNow(240 + index * 20),
    status: cpgStatuses[index],
    remarks: [`Initial BG issued for demo contract ${index + 1}.`, `Submitted by contractor for verification.`, `Verified by finance team.`, `Renewal in progress.`][index % 4],
    isDeleted: false,
    renewedFromId: null,
  }))

  await prisma.cpg.createMany({ data: cpgs, skipDuplicates: true })

  const documentTypes = [
    'BANK_GUARANTEE',
    'CONTRACT_COPY',
    'EXTENSION_LETTER',
    'CLAIM_NOTICE',
    'RELEASE_LETTER',
    'RENEWAL_LETTER',
    'CORRESPONDENCE',
    'OTHER',
    'BANK_GUARANTEE',
    'CONTRACT_COPY',
  ]

  const documents = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-document-${index + 1}`,
    cpgId: cpgs[index].id,
    fileName: `demo-doc-${index + 1}.pdf`,
    fileUrl: `https://res.cloudinary.com/demo/document-${index + 1}.pdf`,
    cloudinaryPublicId: `demo/cpg/document-${index + 1}`,
    documentType: documentTypes[index],
    mimeType: 'application/pdf',
    fileSizeBytes: 150000 + index * 12000,
    version: 1,
    isActive: true,
    isDeleted: false,
    uploadedById: adminUser.id,
  }))

  await prisma.document.createMany({ data: documents, skipDuplicates: true })

  const documentVersions = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-document-version-${index + 1}`,
    documentId: documents[index].id,
    version: 2,
    fileUrl: `https://res.cloudinary.com/demo/document-${index + 1}-v2.pdf`,
    uploadedById: adminUser.id,
  }))

  await prisma.documentVersion.createMany({ data: documentVersions, skipDuplicates: true })

  const riskScores = [92.5, 84.1, 72.3, 45.0, 67.8, 38.6, 88.2, 53.5, 79.4, 96.0]
  const riskAssessments = cpgs.map((cpg, index) => {
    const score = riskScores[index]
    return {
      id: `demo-risk-${index + 1}`,
      cpgId: cpg.id,
      healthScore: score,
      riskLevel: deriveRiskLevel(score),
      anomalyDetected: score < 50,
      anomalyReason: score < 50 ? 'Low health score triggered a risk alert.' : null,
      factors: {
        daysToExpiry: 40 + index * 11,
        extensionCount: index % 3,
        amountToContractRatio: Number((0.04 + index * 0.005).toFixed(4)),
        documentCompleteness: index % 4 === 0 ? 0.8 : 1,
      },
      assessedBySystem: true,
    }
  })

  await prisma.riskAssessment.createMany({ data: riskAssessments, skipDuplicates: true })

  const notifications = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-notification-${index + 1}`,
    userId: adminUser.id,
    type: ['EXPIRY_ALERT', 'ANOMALY_DETECTED', 'STATUS_CHANGE', 'SYSTEM', 'RISK_ESCALATION', 'REMINDER'][index % 6],
    title: [
      'CPG Expiring Soon',
      'Risk Anomaly Detected',
      'CPG Status Updated',
      'Welcome to POWERGRID',
      'Critical Risk Alert',
      'Audit Reminder',
    ][index % 6],
    message: `Demo notification ${index + 1} for CPG ${cpgs[index].bgNumber}.`,
    isRead: index % 3 === 0,
    readAt: index % 3 === 0 ? daysAgo(index + 1) : null,
    relatedEntityType: 'CPG',
    relatedEntityId: cpgs[index].id,
  }))

  await prisma.notification.createMany({ data: notifications, skipDuplicates: true })

  const auditLogs = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-audit-${index + 1}`,
    userId: adminUser.id,
    entityType: ['USER', 'CONTRACTOR', 'CONTRACT', 'CPG', 'DOCUMENT'][index % 5],
    entityId:
      index % 5 === 0
        ? users[index].id
        : index % 5 === 1
          ? contractors[index].id
          : index % 5 === 2
            ? contracts[index].id
            : index % 5 === 3
              ? cpgs[index].id
              : documents[index].id,
    action: ['CREATE', 'UPDATE', 'STATUS_CHANGE', 'UPLOAD', 'LOGIN'][index % 5],
    oldValue: index % 2 === 0 ? { status: 'DRAFT' } : null,
    newValue: index % 2 === 0 ? { status: 'ACTIVE' } : { note: `Demo audit ${index + 1}` },
    ipAddress: `10.0.0.${index + 1}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0',
    metadata: { seed: true, sequence: index + 1 },
  }))

  await prisma.auditLog.createMany({ data: auditLogs, skipDuplicates: true })

  const registrationRequests = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-registration-${index + 1}`,
    firebaseUid: `demo-reg-firebase-${index + 1}`,
    category: index % 2 === 0 ? 'EMPLOYEE' : 'CONTRACTOR',
    status: ['PENDING_APPROVAL', 'MORE_INFORMATION_REQUIRED', 'APPROVED', 'REJECTED'][index % 4],
    email:
      index % 2 === 0
        ? `employee${index + 1}@powergrid-demo.com`
        : `vendor-request${index + 1}@powergrid-demo.com`,
    name: index % 2 === 0 ? `Employee Demo ${index + 1}` : `Vendor Demo ${index + 1}`,
    phone: `+91-98${String(76543210 + index)}`,
    department: index % 2 === 0 ? 'Contract & Procurement' : 'Operations',
    employeeId: index % 2 === 0 ? `EMP-DEMO-${String(index + 1).padStart(3, '0')}` : null,
    companyName: index % 2 === 1 ? `Demo Contractor ${index + 1}` : null,
    vendorCode: index % 2 === 1 ? `DEMO-VND-${String(index + 1).padStart(3, '0')}` : null,
    gstNumber: index % 2 === 1 ? `27DEMOGST${String(index + 1).padStart(3, '0')}` : null,
    panNumber: index % 2 === 1 ? `DEMOPAN${String(index + 1).padStart(3, '0')}` : null,
    contactPerson: index % 2 === 1 ? `Contact Person ${index + 1}` : null,
    companyAddress: index % 2 === 1 ? `Demo Business Park, Mumbai` : null,
    companyState: index % 2 === 1 ? 'Maharashtra' : null,
    currentStage: ['Basic Information', 'Document Review', 'Verification', 'Approval'][index % 4],
    estimatedReviewTime: ['1 Working Day', '2 Working Days', '3 Working Days'][index % 3],
    formData: {
      step1: {
        name: index % 2 === 0 ? `Employee Demo ${index + 1}` : `Vendor Demo ${index + 1}`,
        email: index % 2 === 0 ? `employee${index + 1}@powergrid-demo.com` : `vendor-request${index + 1}@powergrid-demo.com`,
      },
      step2: {
        category: index % 2 === 0 ? 'EMPLOYEE' : 'CONTRACTOR',
        sequence: index + 1,
      },
    },
    uploadedDocs: [
      {
        name: `demo-document-${index + 1}.pdf`,
        url: `https://res.cloudinary.com/demo/registration-${index + 1}.pdf`,
        type: index % 2 === 0 ? 'ID_PROOF' : 'BUSINESS_DOC',
      },
    ],
    reviewedById: adminUser.id,
  }))

  await prisma.registrationRequest.createMany({ data: registrationRequests, skipDuplicates: true })

  const registrationComments = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-registration-comment-${index + 1}`,
    requestId: registrationRequests[index].id,
    authorId: adminUser.id,
    content: `Demo review comment ${index + 1} for ${registrationRequests[index].email}.`,
  }))

  await prisma.registrationComment.createMany({ data: registrationComments, skipDuplicates: true })

  const loginActivities = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-login-${index + 1}`,
    userId: index % 4 === 0 ? adminUser.id : users[(index % (users.length - 1)) + 1].id,
    email: index % 4 === 0 ? adminUser.email : users[(index % (users.length - 1)) + 1].email,
    ipAddress: `192.168.1.${10 + index}`,
    userAgent: index % 2 === 0 ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/605.1.15',
    browser: index % 2 === 0 ? 'Chrome' : 'Safari',
    device: index % 2 === 0 ? 'Desktop' : 'Mobile',
    location: index % 2 === 0 ? 'New Delhi, India' : 'Mumbai, India',
    loginTime: daysAgo(index + 1),
    logoutTime: index % 3 === 0 ? daysAgo(index) : null,
    isSuccessful: index !== 7,
    failureReason: index === 7 ? 'Invalid Firebase ID token' : null,
  }))

  await prisma.loginActivity.createMany({ data: loginActivities, skipDuplicates: true })

  const reports = Array.from({ length: 10 }, (_, index) => ({
    id: `demo-report-${index + 1}`,
    reportName: `Demo-Report-${String(index + 1).padStart(2, '0')}.pdf`,
    generatedById: adminUser.id,
    generatedOn: daysAgo(2 + index),
    downloaded: index % 2 === 0,
    shared: index % 3 === 0,
    fileUrl: `https://res.cloudinary.com/demo/report-${index + 1}.pdf`,
  }))

  await prisma.reportHistory.createMany({ data: reports, skipDuplicates: true })

  console.log('✅ Seeded demo users: 10')
  console.log('✅ Seeded demo contractors: 10')
  console.log('✅ Seeded demo contracts: 10')
  console.log('✅ Seeded demo CPGs: 10')
  console.log('✅ Seeded demo documents: 10')
  console.log('✅ Seeded demo document versions: 10')
  console.log('✅ Seeded demo risk assessments: 10')
  console.log('✅ Seeded demo notifications: 10')
  console.log('✅ Seeded demo audit logs: 10')
  console.log('✅ Seeded demo registration requests: 10')
  console.log('✅ Seeded demo registration comments: 10')
  console.log('✅ Seeded demo login activities: 10')
  console.log('✅ Seeded demo report history rows: 10')
  console.log('\n🎉 Demo seed complete!')
}

seedDemoData()
  .catch((error) => {
    console.error('❌ Demo seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
