import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import DashboardPage from './DashboardPage';
export default function AdminDashboardPage() {
    return _jsxs("div", { className: "space-y-6", children: [_jsxs("section", { className: "rounded-3xl border border-brand-100 bg-brand-50 p-6", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-brand-700", children: "Administrator" }), _jsx("h1", { className: "mt-1 text-2xl font-semibold text-neutral-900", children: "Administration dashboard" }), _jsx("p", { className: "mt-2 text-sm text-neutral-600", children: "Review registrations, manage users, and monitor the CPG portfolio." }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [_jsx(Link, { to: "/dashboard", className: "rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white", children: "Portfolio dashboard" }), _jsx(Link, { to: "/contracts", className: "rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-800", children: "Manage contracts" })] })] }), _jsx(DashboardPage, {})] });
}
