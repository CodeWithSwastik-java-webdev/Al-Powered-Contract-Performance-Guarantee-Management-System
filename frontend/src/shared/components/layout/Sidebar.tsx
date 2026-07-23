import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, FileText, Shield, Layers, UserPlus, Users, Building2, 
  Folder, BarChart3, ClipboardList, Settings, Briefcase, Bell, User, 
  HelpCircle, DollarSign 
} from 'lucide-react'
import PowergridLogo from './PowergridLogo'
import { useAuth } from '../../../contexts/AuthContext'
import { NAV_BY_ROLE } from '../../../config/rbac'

const iconMap: Record<string, any> = {
  LayoutDashboard,
  FileText,
  Shield,
  Layers,
  UserPlus,
  Users,
  Building2,
  Folder,
  BarChart3,
  ClipboardList,
  Settings,
  Briefcase,
  Bell,
  User,
  HelpCircle,
  DollarSign,
}

export default function Sidebar() {
  const { user } = useAuth()
  const navItems = user ? NAV_BY_ROLE[user.role] : []

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'Administrator',
      PROJECT_ENGINEER: 'Project Engineer',
      FINANCE_OFFICER: 'Finance Officer',
      CONTRACT_MANAGER: 'Contract Manager',
      AUDITOR: 'Auditor',
      CONTRACTOR: 'Contractor',
      VIEWER: 'Viewer',
    }
    return labels[role] || role
  }

  return (
    <aside className="hidden w-72 flex-none flex-col border-r border-neutral-200 bg-[#F1F5F3] px-5 py-6 xl:flex">
      <div className="mb-10 flex items-center gap-3">
        <PowergridLogo className="h-10" />
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon || 'LayoutDashboard']
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-neutral-700 hover:bg-white hover:text-neutral-900'
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
      {user && (
        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
          <p className="font-medium text-neutral-900">{user.name}</p>
          <p className="mt-1">{getRoleLabel(user.role)} · Powergrid</p>
        </div>
      )}
    </aside>
  )
}
