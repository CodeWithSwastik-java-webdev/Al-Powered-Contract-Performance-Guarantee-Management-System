import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ContractsPage from './pages/ContractsPage';
import ContractPage from './pages/ContractPage';
import CpgsPage from './pages/CpgsPage';
import ContractorsPage from './pages/ContractorsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from '../contexts/AuthContext';
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
    return user ? _jsx(Navigate, { to: "/dashboard", replace: true }) : children;
}
function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(AuthLayout, { children: _jsx(LoginPage, {}) }) }) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "contractors", element: _jsx(ContractorsPage, {}) }), _jsx(Route, { path: "contracts", element: _jsx(ContractsPage, {}) }), _jsx(Route, { path: "contracts/:id", element: _jsx(ContractPage, {}) }), _jsx(Route, { path: "cpgs", element: _jsx(CpgsPage, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] })] }));
}
export default AppRoutes;
