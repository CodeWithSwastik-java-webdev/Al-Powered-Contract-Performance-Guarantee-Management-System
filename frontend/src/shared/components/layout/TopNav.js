import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
export default function TopNav() {
    const { theme, toggleTheme } = useTheme();
    return (_jsxs("div", { className: "flex items-center justify-between border-b border-neutral-200 bg-white/80 px-6 py-4 backdrop-blur-xl", children: [_jsx("div", { className: "flex items-center gap-4", children: _jsx("div", { className: "text-sm text-neutral-500", children: "Dashboard" }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { className: "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300", children: _jsx(Bell, { className: "h-5 w-5" }) }), _jsx("button", { onClick: toggleTheme, className: "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300", children: theme === 'dark' ? _jsx(Sun, { className: "h-5 w-5" }) : _jsx(Moon, { className: "h-5 w-5" }) })] })] }));
}
