// =============================================================================
// Auth Context — Real Firebase Authentication
// Handles login, registration, logout, token management, and backend sync.
// =============================================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import api from '../lib/api'

// ── Types ──────────────────────────────────────────────────────────────────
export interface AppUser {
  id: string
  firebaseUid: string
  email: string
  name: string
  role: 'ADMIN' | 'ENGINEER' | 'FINANCE' | 'VIEWER'
  department?: string | null
  phone?: string | null
  isActive: boolean
}

interface AuthContextValue {
  /** The backend user profile (null if not authenticated) */
  user: AppUser | null
  /** The raw Firebase user (useful for token access) */
  firebaseUser: FirebaseUser | null
  /** True while Firebase is resolving the initial auth state */
  loading: boolean
  /** Sign in with email + password, then sync with backend */
  login: (credentials: { email: string; password: string }) => Promise<void>
  /** Create a new Firebase account + backend user */
  register: (data: {
    email: string
    password: string
    name: string
    department?: string
  }) => Promise<void>
  /** Sign out of Firebase (clears user) */
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Sync the Firebase user with the backend and store the AppUser
  const syncWithBackend = useCallback(async (fbUser: FirebaseUser): Promise<AppUser | null> => {
    try {
      const token = await fbUser.getIdToken()
      const res = await api.post(
        '/auth/login',
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return res.data?.data?.user ?? null
    } catch (err) {
      console.warn('[Auth] Backend sync failed — user may not exist in DB yet:', err)
      return null
    }
  }, [])

  // Listen for Firebase auth state changes (initial load + tab focus)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        const appUser = await syncWithBackend(fbUser)
        setUser(appUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [syncWithBackend])

  // ── Login ──────────────────────────────────────────────────────────────
  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password)
        const appUser = await syncWithBackend(credential.user)
        setUser(appUser)
        setFirebaseUser(credential.user)
      } catch (err: any) {
        // Record failed attempt server-side so account lockouts can be enforced
        try {
          await api.post('/auth/login/failure', { email, failureReason: err?.message ?? 'signin_failed' })
        } catch (e) {
          // ignore
        }
        throw err
      }
    },
    [syncWithBackend],
  )

  // ── Register ───────────────────────────────────────────────────────────
  const register = useCallback(
    async ({
      email,
      password,
      name,
      department,
    }: {
      email: string
      password: string
      name: string
      department?: string
    }) => {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      const token = await credential.user.getIdToken()

      // Create the user in the backend DB
      const res = await api.post(
        '/auth/register',
        { name, email, department },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setUser(res.data?.data?.user ?? null)
      setFirebaseUser(credential.user)
    },
    [],
  )

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
    setFirebaseUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
