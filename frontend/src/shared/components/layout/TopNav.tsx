import { useLocation, Link } from 'react-router-dom'
import { Bell, Moon, Sun, ChevronRight, LogOut, User } from 'lucide-react'
import { useTheme } from '../../../contexts/ThemeContext'
import { useAuth } from '../../../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'

// ── Breadcrumb builder ─────────────────────────────────────────────────────
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  contracts: 'Contracts',
  cpgs: 'CPGs',
  notifications: 'Notifications',
  'audit-logs': 'Audit Logs',
  'ai-risk': 'AI Risk Analysis',
  reports: 'Reports',
}

function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  return (
    <div className="flex items-center gap-1 text-sm text-neutral-500">
      {segments.map((seg, i) => {
        const label = routeLabels[seg] ?? (seg.length < 24 ? `#${seg}` : seg.slice(0, 8) + '…')
        const path = '/' + segments.slice(0, i + 1).join('/')
        const isLast = i === segments.length - 1

        return (
          <span key={path} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />}
            {isLast ? (
              <span className="font-medium text-neutral-900">{label}</span>
            ) : (
              <Link to={path} className="hover:text-neutral-700 transition">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </div>
  )
}

export default function TopNav() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-white/80 px-6 py-4 backdrop-blur-xl">
      {/* Left: breadcrumbs */}
      <div className="flex items-center gap-4 pl-10 xl:pl-0">
        <Breadcrumbs />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell (placeholder — will be wired in Phase 7) */}
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Unread badge — hardcoded for now, will be dynamic */}
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() ?? '?'}
            </div>
            <span className="hidden sm:inline">{user?.name?.split(' ')[0] ?? 'User'}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-neutral-200 bg-white py-2 shadow-lg">
              <div className="border-b border-neutral-100 px-4 py-3">
                <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
                <p className="mt-1 text-xs font-medium text-brand-600">{user?.role}</p>
              </div>
              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  logout()
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
