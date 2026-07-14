// =============================================================================
// Firebase SDK Configuration
// Initialized using environment variables from Vite (VITE_ prefix)
// =============================================================================

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

if (!firebaseConfig.apiKey) {
  console.warn(
    '⚠️ [Firebase] Initialized with DUMMY credentials because .env variables are missing. ' +
    'Authentication will fail until real credentials are provided in frontend/.env'
  )
} else {
  console.log('✅ [Firebase] Initialized successfully with real credentials.')
}

export default app
