import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import api, { setAccessToken } from '../lib/api'

export interface AppUser { id: string; email: string; name: string; role: 'ADMIN' | 'ENGINEER' | 'FINANCE' | 'VIEWER'; status: string }
export interface RegistrationInput {
  category: 'EMPLOYEE' | 'CONTRACTOR'; email: string; password: string; name: string; phone: string
  department?: string; employeeId?: string; designation?: string; region?: string; companyName?: string
  contactPerson?: string; companyAddress?: string; gstNumber?: string; panNumber?: string; companyWebsite?: string
  uploadedDocs: Array<{ name: string; url: string; publicId: string; type: string; size?: number }>
}
interface AuthContextValue { user: AppUser | null; loading: boolean; login: (credentials: { email: string; password: string }) => Promise<void>; submitRegistration: (data: RegistrationInput) => Promise<string>; logout: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const USER_KEY = 'cpg_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    try { const saved = localStorage.getItem(USER_KEY); if (saved) setUser(JSON.parse(saved) as AppUser) } finally { setLoading(false) }
  }, [])
  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user: loggedInUser, accessToken } = response.data.data as { user: AppUser; accessToken: string }
      setAccessToken(accessToken); localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser)); setUser(loggedInUser)
    } catch (error) {
      void api.post('/auth/login/failure', { email, failureReason: error instanceof Error ? error.message : 'login_failed' }).catch(() => undefined)
      throw error
    }
  }
  const submitRegistration = async (data: RegistrationInput) => {
    const response = await api.post('/registrations', data)
    return response.data.data.id as string
  }
  const logout = async () => { setAccessToken(null); localStorage.removeItem(USER_KEY); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, login, submitRegistration, logout }}>{children}</AuthContext.Provider>
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context }
