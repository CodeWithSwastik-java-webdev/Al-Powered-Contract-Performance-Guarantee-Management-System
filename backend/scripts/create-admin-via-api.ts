/**
 * Create Admin User via SQL
 * This script generates SQL to execute in Railway database
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURE YOUR ADMIN USER HERE
// ═══════════════════════════════════════════════════════════════════════════

const ADMIN_CONFIG = {
  firebaseUid: '6HCOWiuxGJR3QxPpduOAeTU0snf1', // Your Firebase UID
  email: 'swastik123@gmail.com',
  name: 'Admin User',
  phone: '9876543210',
  department: 'Administration',
  employeeId: 'EMP001',
  designation: 'Administrator',
}

function createAdminUser() {
  try {
    console.log('🔄 Generating SQL to create admin user...\n')

    const sqlQuery = `INSERT INTO "User" (
  id,
  firebase_uid,
  email,
  name,
  role,
  status,
  is_active,
  department,
  employee_id,
  phone
) VALUES (
  'user_' || gen_random_uuid()::text,
  '${ADMIN_CONFIG.firebaseUid}',
  '${ADMIN_CONFIG.email}',
  '${ADMIN_CONFIG.name}',
  'ADMIN',
  'ACTIVE',
  true,
  '${ADMIN_CONFIG.department}',
  '${ADMIN_CONFIG.employeeId}',
  '${ADMIN_CONFIG.phone}'
);`

    console.log('📝 SQL Query to execute in Railway:\n')
    console.log(sqlQuery)
    console.log('\n')
    console.log('Steps:')
    console.log('1. Go to Railway Dashboard')
    console.log('2. Open your PostgreSQL database')
    console.log('3. Go to "Data" tab')
    console.log('4. Click "Query Editor"')
    console.log('5. Paste the SQL above')
    console.log('6. Execute\n')
    console.log('After executing:')
    console.log(`✅ Can login with email: ${ADMIN_CONFIG.email}`)
    console.log('✅ Will have ADMIN role')
    console.log('✅ Account status: ACTIVE')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

createAdminUser()

