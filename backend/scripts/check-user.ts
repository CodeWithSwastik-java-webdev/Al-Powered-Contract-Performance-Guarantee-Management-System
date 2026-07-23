/**
 * Diagnose Database User Record
 * Usage: npx ts-node scripts/check-user.ts
 */

import 'dotenv/config'
import { prisma } from '../src/prisma/client'

async function checkUser() {
  try {
    console.log('🔍 Checking database records...\n')

    // Check all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    })

    console.log('📋 All users in database:\n')
    
    if (allUsers.length === 0) {
      console.log('   ❌ No users found!')
    } else {
      allUsers.forEach((user, idx) => {
        console.log(`   ${idx + 1}. Email: ${user.email}`)
        console.log(`      Firebase UID: ${user.firebaseUid}`)
        console.log(`      Name: ${user.name}`)
        console.log(`      Role: ${user.role}`)
        console.log(`      Active: ${user.isActive}\n`)
      })
    }

    // Try to find by specific Firebase UID
    const firebaseUid = '6HCOWiuxGJR3QxPpduOAeTU0snf1'
    console.log(`\n🔎 Searching for Firebase UID: ${firebaseUid}\n`)
    
    const userByUid = await prisma.user.findUnique({
      where: { firebaseUid },
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    })

    if (userByUid) {
      console.log('   ✅ Found!')
      console.log(`   Email: ${userByUid.email}`)
      console.log(`   Name: ${userByUid.name}`)
      console.log(`   Role: ${userByUid.role}`)
      console.log(`   Active: ${userByUid.isActive}`)
    } else {
      console.log('   ❌ Not found!')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

checkUser()
