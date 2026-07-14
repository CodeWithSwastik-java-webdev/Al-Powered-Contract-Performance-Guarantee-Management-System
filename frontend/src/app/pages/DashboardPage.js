import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
const RISK_COLORS = {
    LOW: '#4ADE80',
    MEDIUM: '#FBBF24',
    HIGH: '#F97316',
    CRITICAL: '#EF4444',
};
const STATUS_COLORS = {
    ACTIVE: '#3B82F6',
    SUBMITTED: '#A855F7',
    VERIFIED: '#F59E0B',
    RELEASED: '#10B981',
    EXPIRED: '#EF4444',
};
// ── Components ─────────────────────────────────────────────────────────────
function formatCurrency(value) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(num);
}
function LoadingCard() {
    return (_jsx("div", { className: "h-full w-full animate-pulse rounded-3xl bg-neutral-100 p-6" }));
}
export default function DashboardPage() {
    const { user } = useAuth();
    // ── Queries ──────────────────────────────────────────────────────────────
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const res = await api.get('/dashboard/stats');
            return res.data.data;
        },
    });
    const { data: charts, isLoading: chartsLoading } = useQuery({
        queryKey: ['dashboard', 'charts'],
        queryFn: async () => {
            const res = await api.get('/dashboard/charts');
            return res.data.data;
        },
    });
    const { data: activity, isLoading: activityLoading } = useQuery({
        queryKey: ['dashboard', 'activity'],
        queryFn: async () => {
            const res = await api.get('/dashboard/recent-activity');
            return res.data.data;
        },
    });
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("header", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm uppercase tracking-[0.24em] text-neutral-500", children: ["Welcome back, ", user?.name?.split(' ')[0] ?? 'User'] }), _jsx("h1", { className: "mt-2 text-3xl font-semibold text-neutral-900", children: "CPG portfolio overview" })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(Link, { to: "/cpgs?filter=expiring-soon", className: "rounded-3xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400", children: "View expiring" }), _jsx(Link, { to: "/ai-risk", className: "rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700", children: "AI summary" })] })] }), _jsx("section", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-6", children: statsLoading ? (Array.from({ length: 6 }).map((_, i) => _jsx(LoadingCard, {}, i))) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.1em] text-neutral-500 truncate", children: "Total Contracts" }), _jsx("p", { className: "mt-4 text-3xl font-semibold text-neutral-900", children: stats?.activeContracts ?? 0 })] }), _jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.1em] text-neutral-500 truncate", children: "Active CPGs" }), _jsx("p", { className: "mt-4 text-3xl font-semibold text-neutral-900", children: stats?.activeCpgs ?? 0 })] }), _jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface sm:col-span-2 xl:col-span-2", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.1em] text-neutral-500 truncate", children: "Total CPG Value" }), _jsx("p", { className: "mt-4 text-3xl font-semibold text-brand-600 truncate", children: formatCurrency(stats?.totalCpgValue ?? 0) })] }), _jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.1em] text-neutral-500 truncate", children: "Avg Health" }), _jsxs("div", { className: "mt-4 flex items-end gap-2", children: [_jsx("p", { className: "text-3xl font-semibold text-neutral-900", children: parseFloat(stats?.avgHealthScore ?? '100').toFixed(1) }), _jsx("span", { className: "mb-1 text-sm text-neutral-500", children: "/ 100" })] })] }), _jsxs("div", { className: "rounded-3xl border border-red-100 bg-red-50 p-6", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.1em] text-red-600 truncate", children: "Anomalies" }), _jsx("p", { className: "mt-4 text-3xl font-semibold text-red-700", children: stats?.activeAnomalies ?? 0 })] })] })) }), _jsxs("section", { className: "grid gap-6 xl:grid-cols-3", children: [_jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface xl:col-span-1", children: [_jsx("h2", { className: "mb-6 font-semibold text-neutral-900", children: "Risk Distribution" }), _jsx("div", { className: "h-64", children: chartsLoading ? (_jsx(LoadingCard, {})) : charts?.riskDistribution.length ? (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: charts.riskDistribution, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 80, paddingAngle: 5, dataKey: "value", children: charts.riskDistribution.map((entry, index) => (_jsx(Cell, { fill: RISK_COLORS[entry.name] || '#D1D5DB' }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: { borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } })] }) })) : (_jsx("div", { className: "flex h-full items-center justify-center text-sm text-neutral-500", children: "No risk data available" })) }), _jsx("div", { className: "mt-4 flex flex-wrap justify-center gap-4 text-sm", children: Object.keys(RISK_COLORS).map((key) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-3 w-3 rounded-full", style: { backgroundColor: RISK_COLORS[key] } }), _jsx("span", { className: "text-neutral-600", children: key })] }, key))) })] }), _jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface xl:col-span-1", children: [_jsx("h2", { className: "mb-6 font-semibold text-neutral-900", children: "Monthly Expirations" }), _jsx("div", { className: "h-64", children: chartsLoading ? (_jsx(LoadingCard, {})) : charts?.monthlyExpirations.length ? (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: charts.monthlyExpirations, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorValue", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#2D6A4F", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#2D6A4F", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#E2E8E6" }), _jsx(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: { fontSize: 12, fill: '#6B7280' }, dy: 10 }), _jsx(YAxis, { axisLine: false, tickLine: false, tick: { fontSize: 12, fill: '#6B7280' } }), _jsx(Tooltip, { contentStyle: { borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } }), _jsx(Area, { type: "monotone", dataKey: "value", stroke: "#2D6A4F", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorValue)" })] }) })) : (_jsx("div", { className: "flex h-full items-center justify-center text-sm text-neutral-500", children: "No expiration data" })) })] }), _jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface xl:col-span-1", children: [_jsx("h2", { className: "mb-6 font-semibold text-neutral-900", children: "Recent Activity" }), _jsx("div", { className: "flex h-64 flex-col gap-4 overflow-y-auto pr-2", children: activityLoading ? (_jsx(LoadingCard, {})) : activity?.length ? (activity.map((log) => (_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "mt-1 flex h-2 w-2 shrink-0 rounded-full bg-brand-500" }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm text-neutral-900", children: [_jsx("span", { className: "font-medium", children: log.user?.name ?? 'System' }), " ", log.action.toLowerCase(), ' ', _jsx("span", { className: "font-medium", children: log.entityType.toLowerCase() })] }), _jsx("p", { className: "mt-1 text-xs text-neutral-500", children: new Date(log.createdAt).toLocaleString() })] })] }, log.id)))) : (_jsx("div", { className: "flex h-full items-center justify-center text-sm text-neutral-500", children: "No recent activity" })) })] })] })] }));
}
