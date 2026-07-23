import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'
import PremiumLoginPage from './pages/PremiumLoginPage'
import RegisterLandingPage from './pages/RegisterLandingPage'
import RegistrationWizard from './pages/RegistrationWizard'
import TrackingPage from './pages/TrackingPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import DashboardPage from './pages/DashboardPage'
import ContractsPage from './pages/ContractsPage'
import ContractPage from './pages/ContractPage'
import CpgsPage from './pages/CpgsPage'
import ContractorsPage from './pages/ContractorsPage'
import NotFoundPage from './pages/NotFoundPage'
import EngineerDashboardPage from './pages/dashboards/EngineerDashboardPage'
import FinanceDashboardPage from './pages/dashboards/FinanceDashboardPage'
import ContractManagerDashboardPage from './pages/dashboards/ContractManagerDashboardPage'
import AuditorDashboardPage from './pages/dashboards/AuditorDashboardPage'
import ContractorDashboardPage from './pages/dashboards/ContractorDashboardPage'
import ViewerDashboardPage from './pages/dashboards/ViewerDashboardPage'
import DocumentsPage from './pages/DocumentsPage'
import ReportsPage from './pages/ReportsPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ProjectsPage from './pages/ProjectsPage'
import SupportPage from './pages/SupportPage'
import RegistrationRequestsPage from './pages/RegistrationRequestsPage'
import UserManagementPage from './pages/UserManagementPage'
import { useAuth } from '../contexts/AuthContext'
import { getHomeForRole, canAccessRoute, type AppRole } from '../config/rbac'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to={getHomeForRole(user.role)} replace /> : children
}

function RoleRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles: AppRole[] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeForRole(user.role)} replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout><PremiumLoginPage /></AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthLayout><RegisterLandingPage /></AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register/employee"
        element={
          <PublicRoute>
            <AuthLayout><RegistrationWizard category="EMPLOYEE" /></AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register/contractor"
        element={
          <PublicRoute>
            <AuthLayout><RegistrationWizard category="CONTRACTOR" /></AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/track/:appId"
        element={
          <PublicRoute>
            <AuthLayout><TrackingPage /></AuthLayout>
          </PublicRoute>
        }
      />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>        
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Admin routes */}
        <Route path="admin/dashboard" element={<RoleRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></RoleRoute>} />
        
        {/* Engineer routes */}
        <Route path="engineer/dashboard" element={<RoleRoute allowedRoles={['PROJECT_ENGINEER']}><EngineerDashboardPage /></RoleRoute>} />
        
        {/* Finance routes */}
        <Route path="finance/dashboard" element={<RoleRoute allowedRoles={['FINANCE_OFFICER']}><FinanceDashboardPage /></RoleRoute>} />
        <Route path="finance" element={<RoleRoute allowedRoles={['FINANCE_OFFICER']}><FinanceDashboardPage /></RoleRoute>} />
        
        {/* Contract Manager routes */}
        <Route path="contracts/dashboard" element={<RoleRoute allowedRoles={['CONTRACT_MANAGER']}><ContractManagerDashboardPage /></RoleRoute>} />
        
        {/* Auditor routes */}
        <Route path="audit/dashboard" element={<RoleRoute allowedRoles={['AUDITOR']}><AuditorDashboardPage /></RoleRoute>} />
        <Route path="audit/logs" element={<RoleRoute allowedRoles={['AUDITOR', 'ADMIN']}><AuditorDashboardPage /></RoleRoute>} />
        
        {/* Contractor routes */}
        <Route path="contractor/dashboard" element={<RoleRoute allowedRoles={['CONTRACTOR']}><ContractorDashboardPage /></RoleRoute>} />
        <Route path="contractor/contracts" element={<RoleRoute allowedRoles={['CONTRACTOR']}><ContractsPage /></RoleRoute>} />
        <Route path="contractor/cpgs" element={<RoleRoute allowedRoles={['CONTRACTOR']}><CpgsPage /></RoleRoute>} />
        
        {/* Viewer routes */}
        <Route path="viewer/dashboard" element={<RoleRoute allowedRoles={['VIEWER']}><ViewerDashboardPage /></RoleRoute>} />
        
        {/* Shared routes with role-based access */}
        <Route path="contractors" element={<RoleRoute allowedRoles={['ADMIN', 'PROJECT_ENGINEER', 'CONTRACT_MANAGER']}><ContractorsPage /></RoleRoute>} />
        <Route path="contracts" element={<RoleRoute allowedRoles={['ADMIN', 'PROJECT_ENGINEER', 'CONTRACT_MANAGER', 'FINANCE_OFFICER']}><ContractsPage /></RoleRoute>} />
        <Route path="contracts/:id" element={<ContractPage />} />
        <Route path="cpgs" element={<RoleRoute allowedRoles={['ADMIN', 'PROJECT_ENGINEER', 'CONTRACT_MANAGER', 'FINANCE_OFFICER']}><CpgsPage /></RoleRoute>} />
        
        {/* Stub routes for sidebar completeness */}
        <Route path="admin/registrations" element={<RoleRoute allowedRoles={['ADMIN']}><RegistrationRequestsPage /></RoleRoute>} />
        <Route path="admin/users" element={<RoleRoute allowedRoles={['ADMIN']}><UserManagementPage /></RoleRoute>} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<RoleRoute allowedRoles={['ADMIN']}><SettingsPage /></RoleRoute>} />
        <Route path="projects" element={<RoleRoute allowedRoles={['PROJECT_ENGINEER']}><ProjectsPage /></RoleRoute>} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="support" element={<RoleRoute allowedRoles={['CONTRACTOR']}><SupportPage /></RoleRoute>} />
        <Route path="contractor/documents" element={<RoleRoute allowedRoles={['CONTRACTOR']}><DocumentsPage /></RoleRoute>} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
