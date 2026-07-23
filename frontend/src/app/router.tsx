import { Route, Routes, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'
import PremiumLoginPage from './pages/PremiumLoginPage'
import RegisterLandingPage from './pages/RegisterLandingPage'
import RegistrationWizard from './pages/RegistrationWizard'
import TrackingPage from './pages/TrackingPage'
import DashboardPage from './pages/DashboardPage'
import ContractsPage from './pages/ContractsPage'
import ContractPage from './pages/ContractPage'
import CpgsPage from './pages/CpgsPage'
import ContractorsPage from './pages/ContractorsPage'
import NotFoundPage from './pages/NotFoundPage'
import { useAuth } from '../contexts/AuthContext'

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
  const { user, loading, firebaseUser } = useAuth()
  if (loading) return null
  // If the user is authenticated in Firebase but doesn't have an app profile yet,
  // redirect them to the onboarding entry page to start registration.
  if (firebaseUser && !user) return <Navigate to="/register" replace />
  return user ? <Navigate to="/dashboard" replace /> : children
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
        <Route path="contractors" element={<ContractorsPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="contracts/:id" element={<ContractPage />} />
        <Route path="cpgs" element={<CpgsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
