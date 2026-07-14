import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { Home, FileText, Shield, Brain, Bell, ClipboardList, FileBarChart, LogOut, Menu, X, } from 'lucide-react';
import PowergridLogo from './PowergridLogo';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';
const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: Home },
    { label: 'Contractors', to: '/contractors', icon: FileText },
    { label: 'Contracts', to: '/contracts', icon: FileText },
    { label: 'CPGs', to: '/cpgs', icon: Shield },
    { label: 'Notifications', to: '/notifications', icon: Bell },
    { label: 'Audit Logs', to: '/audit-logs', icon: ClipboardList },
    { label: 'AI Risk', to: '/ai-risk', icon: Brain },
    { label: 'Reports', to: '/reports', icon: FileBarChart },
];
export default function Sidebar() {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const sidebarContent = (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-10 flex items-center gap-3", children: _jsx(PowergridLogo, { className: "h-10" }) }), _jsx("nav", { className: "flex flex-1 flex-col gap-1", children: navItems.map((item) => {
                    const Icon = item.icon;
                    return (_jsx(NavLink, { to: item.to, onClick: () => setMobileOpen(false), className: ({ isActive }) => `rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                            ? 'bg-brand-50 text-brand-700 shadow-sm'
                            : 'text-neutral-600 hover:bg-white hover:text-neutral-900'}`, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Icon, { className: "h-5 w-5" }), _jsx("span", { children: item.label })] }) }, item.to));
                }) }), _jsxs("div", { className: "mt-6 space-y-3", children: [_jsx("div", { className: "rounded-xl border border-neutral-200 bg-white p-4 text-sm", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold text-xs", children: user?.name
                                        ?.split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase() ?? '?' }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate font-medium text-neutral-900", children: user?.name ?? 'User' }), _jsxs("p", { className: "truncate text-xs text-neutral-500", children: [user?.role ?? 'Unknown', " \u00B7 ", user?.department ?? 'POWERGRID'] })] })] }) }), _jsxs("button", { onClick: logout, className: "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50", children: [_jsx(LogOut, { className: "h-5 w-5" }), _jsx("span", { children: "Sign out" })] })] })] }));
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setMobileOpen(true), className: "fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm xl:hidden", "aria-label": "Open navigation", children: _jsx(Menu, { className: "h-5 w-5" }) }), mobileOpen && (_jsx("div", { className: "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm xl:hidden", onClick: () => setMobileOpen(false) })), _jsxs("aside", { className: `fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-[#F1F5F3] px-5 py-6 transition-transform duration-300 xl:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`, children: [_jsx("button", { onClick: () => setMobileOpen(false), className: "absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900", "aria-label": "Close navigation", children: _jsx(X, { className: "h-5 w-5" }) }), sidebarContent] }), _jsx("aside", { className: "hidden w-72 flex-none flex-col border-r border-neutral-200 bg-[#F1F5F3] px-5 py-6 xl:flex", children: sidebarContent })] }));
}
