// =============================================================================
// Firebase SDK Configuration
// Initialized using environment variables from Vite (VITE_ prefix)
// =============================================================================

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'dummy-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dummy-auth-domain',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dummy-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dummy-storage-bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'dummy-sender-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

if (firebaseConfig.apiKey === 'dummy-api-key') {
  console.warn(
    '⚠️ [Firebase] Initialized with DUMMY credentials because .env variables are missing. ' +
    'Authentication will fail until real credentials are provided in frontend/.env'
  )
} else {
  console.log('✅ [Firebase] Initialized successfully with real credentials.')
}

export default app
