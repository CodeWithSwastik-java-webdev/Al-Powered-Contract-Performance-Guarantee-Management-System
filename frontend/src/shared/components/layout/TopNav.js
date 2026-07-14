import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, Link } from 'react-router-dom';
import { Bell, Moon, Sun, ChevronRight, LogOut, User } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
// ── Breadcrumb builder ─────────────────────────────────────────────────────
const routeLabels = {
    dashboard: 'Dashboard',
    contracts: 'Contracts',
    cpgs: 'CPGs',
    notifications: 'Notifications',
    'audit-logs': 'Audit Logs',
    'ai-risk': 'AI Risk Analysis',
    reports: 'Reports',
};
function Breadcrumbs() {
    const location = useLocation();
    const segments = location.pathname.split('/').filter(Boolean);
    return (_jsx("div", { className: "flex items-center gap-1 text-sm text-neutral-500", children: segments.map((seg, i) => {
            const label = routeLabels[seg] ?? (seg.length < 24 ? `#${seg}` : seg.slice(0, 8) + '…');
            const path = '/' + segments.slice(0, i + 1).join('/');
            const isLast = i === segments.length - 1;
            return (_jsxs("span", { className: "flex items-center gap-1", children: [i > 0 && _jsx(ChevronRight, { className: "h-3.5 w-3.5 text-neutral-400" }), isLast ? (_jsx("span", { className: "font-medium text-neutral-900", children: label })) : (_jsx(Link, { to: path, className: "hover:text-neutral-700 transition", children: label }))] }, path));
        }) }));
}
export default function TopNav() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    // Close menu on outside click
    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);
    return (_jsxs("div", { className: "flex items-center justify-between border-b border-neutral-200 bg-white/80 px-6 py-4 backdrop-blur-xl", children: [_jsx("div", { className: "flex items-center gap-4 pl-10 xl:pl-0", children: _jsx(Breadcrumbs, {}) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { className: "relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300", "aria-label": "Notifications", children: [_jsx(Bell, { className: "h-5 w-5" }), _jsx("span", { className: "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white", children: "3" })] }), _jsx("button", { onClick: toggleTheme, className: "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300", "aria-label": "Toggle theme", children: theme === 'dark' ? _jsx(Sun, { className: "h-5 w-5" }) : _jsx(Moon, { className: "h-5 w-5" }) }), _jsxs("div", { className: "relative", ref: menuRef, children: [_jsxs("button", { onClick: () => setMenuOpen(!menuOpen), className: "flex h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300", children: [_jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold", children: user?.name
                                            ?.split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .slice(0, 2)
                                            .toUpperCase() ?? '?' }), _jsx("span", { className: "hidden sm:inline", children: user?.name?.split(' ')[0] ?? 'User' })] }), menuOpen && (_jsxs("div", { className: "absolute right-0 top-12 z-50 w-56 rounded-xl border border-neutral-200 bg-white py-2 shadow-lg", children: [_jsxs("div", { className: "border-b border-neutral-100 px-4 py-3", children: [_jsx("p", { className: "text-sm font-medium text-neutral-900", children: user?.name }), _jsx("p", { className: "text-xs text-neutral-500", children: user?.email }), _jsx("p", { className: "mt-1 text-xs font-medium text-brand-600", children: user?.role })] }), _jsxs("button", { className: "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition", children: [_jsx(User, { className: "h-4 w-4" }), "Profile"] }), _jsxs("button", { onClick: () => {
                                            setMenuOpen(false);
                                            logout();
                                        }, className: "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition", children: [_jsx(LogOut, { className: "h-4 w-4" }), "Sign out"] })] }))] })] })] }));
}
