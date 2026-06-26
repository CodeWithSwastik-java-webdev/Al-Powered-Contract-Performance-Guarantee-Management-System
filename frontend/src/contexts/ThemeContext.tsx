import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light')

  useEffect(() => {
    const stored = window.localStorage.getItem('powergrid-theme') as ThemeMode | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(stored ?? (prefersDark ? 'dark' : 'light'))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('powergrid-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
