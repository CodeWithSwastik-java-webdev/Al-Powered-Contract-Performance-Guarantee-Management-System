import { Route, Routes, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ContractsPage from './pages/ContractsPage'
import ContractPage from './pages/ContractPage'
import CpgsPage from './pages/CpgsPage'
import NotFoundPage from './pages/NotFoundPage'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout><LoginPage /></AuthLayout>
          </PublicRoute>
        }
      />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>        
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="contracts/:id" element={<ContractPage />} />
        <Route path="cpgs" element={<CpgsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
