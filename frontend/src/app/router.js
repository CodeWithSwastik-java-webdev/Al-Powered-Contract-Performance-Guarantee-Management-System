import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ContractsPage from './pages/ContractsPage';
import ContractPage from './pages/ContractPage';
import CpgsPage from './pages/CpgsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from '../contexts/AuthContext';
function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : _jsx(Navigate, { to: "/login", replace: true });
}
function PublicRoute({ children }) {
    const { user } = useAuth();
    return user ? _jsx(Navigate, { to: "/dashboard", replace: true }) : children;
}
function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(AuthLayout, { children: _jsx(LoginPage, {}) }) }) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "contracts", element: _jsx(ContractsPage, {}) }), _jsx(Route, { path: "contracts/:id", element: _jsx(ContractPage, {}) }), _jsx(Route, { path: "cpgs", element: _jsx(CpgsPage, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] })] }));
}
export default AppRoutes;
