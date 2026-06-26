import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextValue {
  user: { email: string } | null
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null)

  const login = async ({ email, password }: { email: string; password: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (email === 'admin@powergrid.com' && password === 'password123') {
      setUser({ email })
      return
    }

    throw new Error('Invalid email or password')
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
