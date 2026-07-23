import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import PremiumLoginPage from './pages/PremiumLoginPage';
import RegisterLandingPage from './pages/RegisterLandingPage';
import RegistrationWizard from './pages/RegistrationWizard';
import TrackingPage from './pages/TrackingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardPage from './pages/DashboardPage';
import ContractsPage from './pages/ContractsPage';
import ContractPage from './pages/ContractPage';
import CpgsPage from './pages/CpgsPage';
import ContractorsPage from './pages/ContractorsPage';
import NotFoundPage from './pages/NotFoundPage';
import EngineerDashboardPage from './pages/dashboards/EngineerDashboardPage';
import FinanceDashboardPage from './pages/dashboards/FinanceDashboardPage';
import ContractManagerDashboardPage from './pages/dashboards/ContractManagerDashboardPage';
import AuditorDashboardPage from './pages/dashboards/AuditorDashboardPage';
import ContractorDashboardPage from './pages/dashboards/ContractorDashboardPage';
import ViewerDashboardPage from './pages/dashboards/ViewerDashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProjectsPage from './pages/ProjectsPage';
import SupportPage from './pages/SupportPage';
import RegistrationRequestsPage from './pages/RegistrationRequestsPage';
import UserManagementPage from './pages/UserManagementPage';
import { useAuth } from '../contexts/AuthContext';
import { getHomeForRole } from '../config/rbac';
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-[var(--background)]", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" }), _jsx("p", { className: "text-sm text-neutral-500", children: "Loading..." })] }) }));
    }
    return user ? children : _jsx(Navigate, { to: "/login", replace: true });
}
function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading)
        return null;
    return user ? _jsx(Navigate, { to: getHomeForRole(user.role), replace: true }) : children;
}
function RoleRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-[var(--background)]", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" }), _jsx("p", { className: "text-sm text-neutral-500", children: "Loading..." })] }) }));
    }
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location } });
    if (!allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: getHomeForRole(user.role), replace: true });
    }
    return children;
}
function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(AuthLayout, { children: _jsx(PremiumLoginPage, {}) }) }) }), _jsx(Route, { path: "/register", element: _jsx(PublicRoute, { children: _jsx(AuthLayout, { children: _jsx(RegisterLandingPage, {}) }) }) }), _jsx(Route, { path: "/register/employee", element: _jsx(PublicRoute, { children: _jsx(AuthLayout, { children: _jsx(RegistrationWizard, { category: "EMPLOYEE" }) }) }) }), _jsx(Route, { path: "/register/contractor", element: _jsx(PublicRoute, { children: _jsx(AuthLayout, { children: _jsx(RegistrationWizard, { category: "CONTRACTOR" }) }) }) }), _jsx(Route, { path: "/track/:appId", element: _jsx(PublicRoute, { children: _jsx(AuthLayout, { children: _jsx(TrackingPage, {}) }) }) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "admin/dashboard", element: _jsx(RoleRoute, { allowedRoles: ['ADMIN'], children: _jsx(AdminDashboardPage, {}) }) }), _jsx(Route, { path: "engineer/dashboard", element: _jsx(RoleRoute, { allowedRoles: ['PROJECT_ENGINEER'], children: _jsx(EngineerDashboardPage, {}) }) }), _jsx(Route, { path: "finance/dashboard", element: _jsx(RoleRoute, { allowedRoles: ['FINANCE_OFFICER'], children: _jsx(FinanceDashboardPage, {}) }) }), _jsx(Route, { path: "finance", element: _jsx(RoleRoute, { allowedRoles: ['FINANCE_OFFICER'], children: _jsx(FinanceDashboardPage, {}) }) }), _jsx(Route, { path: "contracts/dashboard", element: _jsx(RoleRoute, { allowedRoles: ['CONTRACT_MANAGER'], children: _jsx(ContractManagerDashboardPage, {}) }) }), _jsx(Route, { path: "audit/dashboard", element: _jsx(RoleRoute, { allowedRoles: ['AUDITOR'], children: _jsx(AuditorDashboardPage, {}) }) }), _jsx(Route, { path: "audit/logs", element: _jsx(RoleRoute, { allowedRoles: ['AUDITOR', 'ADMIN'], children: _jsx(AuditorDashboardPage, {}) }) }), _jsx(Route, { path: "contractor/dashboard", element: _jsx(RoleRoute, { allowedRoles: ['CONTRACTOR'], children: _jsx(ContractorDashboardPage, {}) }) }), _jsx(Route, { path: "contractor/contracts", element: _jsx(RoleRoute, { allowedRoles: ['CONTRACTOR'], children: _jsx(ContractsPage, {}) }) }), _jsx(Route, { path: "contractor/cpgs", element: _jsx(RoleRoute, { allowedRoles: ['CONTRACTOR'], children: _jsx(CpgsPage, {}) }) }), _jsx(Route, { path: "viewer/dashboard", element: _jsx(RoleRoute, { allowedRoles: ['VIEWER'], children: _jsx(ViewerDashboardPage, {}) }) }), _jsx(Route, { path: "contractors", element: _jsx(RoleRoute, { allowedRoles: ['ADMIN', 'PROJECT_ENGINEER', 'CONTRACT_MANAGER'], children: _jsx(ContractorsPage, {}) }) }), _jsx(Route, { path: "contracts", element: _jsx(RoleRoute, { allowedRoles: ['ADMIN', 'PROJECT_ENGINEER', 'CONTRACT_MANAGER', 'FINANCE_OFFICER'], children: _jsx(ContractsPage, {}) }) }), _jsx(Route, { path: "contracts/:id", element: _jsx(ContractPage, {}) }), _jsx(Route, { path: "cpgs", element: _jsx(RoleRoute, { allowedRoles: ['ADMIN', 'PROJECT_ENGINEER', 'CONTRACT_MANAGER', 'FINANCE_OFFICER'], children: _jsx(CpgsPage, {}) }) }), _jsx(Route, { path: "admin/registrations", element: _jsx(RoleRoute, { allowedRoles: ['ADMIN'], children: _jsx(RegistrationRequestsPage, {}) }) }), _jsx(Route, { path: "admin/users", element: _jsx(RoleRoute, { allowedRoles: ['ADMIN'], children: _jsx(UserManagementPage, {}) }) }), _jsx(Route, { path: "documents", element: _jsx(DocumentsPage, {}) }), _jsx(Route, { path: "reports", element: _jsx(ReportsPage, {}) }), _jsx(Route, { path: "settings", element: _jsx(RoleRoute, { allowedRoles: ['ADMIN'], children: _jsx(SettingsPage, {}) }) }), _jsx(Route, { path: "projects", element: _jsx(RoleRoute, { allowedRoles: ['PROJECT_ENGINEER'], children: _jsx(ProjectsPage, {}) }) }), _jsx(Route, { path: "notifications", element: _jsx(NotificationsPage, {}) }), _jsx(Route, { path: "profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "support", element: _jsx(RoleRoute, { allowedRoles: ['CONTRACTOR'], children: _jsx(SupportPage, {}) }) }), _jsx(Route, { path: "contractor/documents", element: _jsx(RoleRoute, { allowedRoles: ['CONTRACTOR'], children: _jsx(DocumentsPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] })] }));
}
export default AppRoutes;
