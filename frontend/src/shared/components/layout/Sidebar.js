import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { Home, FileText, Shield, Layers } from 'lucide-react';
import PowergridLogo from './PowergridLogo';
const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: Home },
    { label: 'Contracts', to: '/contracts', icon: FileText },
    { label: 'CPGs', to: '/cpgs', icon: Shield },
    { label: 'AI Risk', to: '/ai-risk', icon: Layers },
];
export default function Sidebar() {
    return (_jsxs("aside", { className: "hidden w-72 flex-none flex-col border-r border-neutral-200 bg-[#F1F5F3] px-5 py-6 xl:flex", children: [_jsx("div", { className: "mb-10 flex items-center gap-3", children: _jsx(PowergridLogo, { className: "h-10" }) }), _jsx("nav", { className: "flex flex-1 flex-col gap-2", children: navItems.map((item) => {
                    const Icon = item.icon;
                    return (_jsx(NavLink, { to: item.to, className: ({ isActive }) => `rounded-3xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-neutral-700 hover:bg-white hover:text-neutral-900'}`, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Icon, { className: "h-5 w-5" }), _jsx("span", { children: item.label })] }) }, item.to));
                }) }), _jsxs("div", { className: "mt-10 rounded-3xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700", children: [_jsx("p", { className: "font-medium text-neutral-900", children: "Col. Sharma" }), _jsx("p", { className: "mt-1", children: "Finance \u00B7 Powergrid" })] })] }));
}
