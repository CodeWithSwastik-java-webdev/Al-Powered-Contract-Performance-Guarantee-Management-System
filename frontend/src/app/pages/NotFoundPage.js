import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export default function NotFoundPage() {
    return (_jsxs("div", { className: "flex min-h-[70vh] flex-col items-center justify-center px-4 text-center", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.28em] text-neutral-500", children: "404" }), _jsx("h1", { className: "mt-4 text-4xl font-semibold text-neutral-900", children: "Page not found" }), _jsx("p", { className: "mt-3 max-w-md text-sm text-neutral-600", children: "The route you are trying to access does not exist or has been moved." }), _jsx(Link, { to: "/dashboard", className: "mt-6 inline-flex rounded-3xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700", children: "Return to dashboard" })] }));
}
