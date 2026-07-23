/**
 * Create Admin User in Database
 * Usage: npx ts-node scripts/create-admin-user.ts
 * 
 * This script creates admin users directly in the database linked to existing Firebase accounts.
 * You need to provide:
 * 1. Firebase UID of the user (from Firebase Console)
 * 2. User email and name
 * 3. Department/Employee ID (optional)
 */

import 'dotenv/config'
import { prisma } from '../src/prisma/client'

async function createAdminUser() {
  // ═══════════════════════════════════════════════════════════════════════════
  // CONFIGURE YOUR ADMIN USERS HERE
  // ═══════════════════════════════════════════════════════════════════════════
  
  const adminUsers = [
    {
      firebaseUid: '6HCOWiuxGJR3QxPpduOAeTU0snf1',  // Get from Firebase Console
      email: 'swastik123@gmail.com',
      name: 'Admin User',
      role: 'ADMIN' as const,
      department: 'Administration',
      employeeId: 'EMP001',
    },
    // Add more admins as needed:
    // {
    //   firebaseUid: 'REPLACE_WITH_FIREBASE_UID_2',
    //   email: 'manager@powergrid.com',
    //   name: 'Manager User',
    //   role: 'ADMIN',
    //   department: 'Operations',
    //   employeeId: 'EMP002',
    // },
  ]

  try {
    console.log('🔄 Creating admin users...\n')
    
    for (const adminData of adminUsers) {
      // Check if Firebase UID is configured
      if (adminData.firebaseUid === 'REPLACE_WITH_FIREBASE_UID_1') {
        console.warn(`⚠️  Skipping ${adminData.email} — Firebase UID not configured`)
        console.log('   Get the Firebase UID from Firebase Console → Users → Click user → copy UID\n')
        continue
      }

      // Check if user already exists
      const existing = await prisma.user.findUnique({
        where: { firebaseUid: adminData.firebaseUid },
      })

      if (existing) {
        console.log(`✓ User already exists: ${adminData.email}`)
        console.log(`  ID: ${existing.id}`)
        console.log(`  Role: ${existing.role}\n`)
        continue
      }

      // Create the user
      const user = await prisma.user.create({
        data: {
          firebaseUid: adminData.firebaseUid,
          email: adminData.email,
          name: adminData.name,
          role: adminData.role,
          department: adminData.department,
          employeeId: adminData.employeeId,
          status: 'ACTIVE',
          isActive: true,
        },
      })

      console.log(`✅ Created admin user: ${user.email}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Status: ${user.status}\n`)
    }

    console.log('✨ Done!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

createAdminUser()
