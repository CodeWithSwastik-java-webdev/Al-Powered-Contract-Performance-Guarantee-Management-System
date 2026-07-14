import { NavLink } from 'react-router-dom'
import {
  Home,
  FileText,
  Shield,
  Brain,
  Bell,
  ClipboardList,
  FileBarChart,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import PowergridLogo from './PowergridLogo'
import { useAuth } from '../../../contexts/AuthContext'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Contractors', to: '/contractors', icon: FileText },
  { label: 'Contracts', to: '/contracts', icon: FileText },
  { label: 'CPGs', to: '/cpgs', icon: Shield },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Audit Logs', to: '/audit-logs', icon: ClipboardList },
  { label: 'AI Risk', to: '/ai-risk', icon: Brain },
  { label: 'Reports', to: '/reports', icon: FileBarChart },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="mb-10 flex items-center gap-3">
        <PowergridLogo className="h-10" />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 shadow-sm'
                    : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="mt-6 space-y-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold text-xs">
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-neutral-900">
                {user?.name ?? 'User'}
              </p>
              <p className="truncate text-xs text-neutral-500">
                {user?.role ?? 'Unknown'} · {user?.department ?? 'POWERGRID'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign out</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm xl:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm xl:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-[#F1F5F3] px-5 py-6 transition-transform duration-300 xl:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-72 flex-none flex-col border-r border-neutral-200 bg-[#F1F5F3] px-5 py-6 xl:flex">
        {sidebarContent}
      </aside>
    </>
  )
}
