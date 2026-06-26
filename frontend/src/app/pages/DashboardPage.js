import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function DashboardPage() {
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("header", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-neutral-500", children: "Welcome back, Col. Sharma" }), _jsx("h1", { className: "mt-2 text-3xl font-semibold text-neutral-900", children: "CPG portfolio overview" })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("button", { className: "rounded-3xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400", children: "View expiring" }), _jsx("button", { className: "rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700", children: "AI summary" })] })] }), _jsx("section", { className: "grid gap-4 xl:grid-cols-6", children: [
                    { label: 'Total contracts', value: '248' },
                    { label: 'Active CPGs', value: '412' },
                    { label: 'Expiring soon', value: '23' },
                    { label: 'Released', value: '89' },
                    { label: 'Invoked', value: '4' },
                    { label: 'Avg health', value: '82.4' },
                ].map((metric) => (_jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.22em] text-neutral-500", children: metric.label }), _jsx("p", { className: "mt-4 text-3xl font-semibold text-neutral-900", children: metric.value })] }, metric.label))) })] }));
}
