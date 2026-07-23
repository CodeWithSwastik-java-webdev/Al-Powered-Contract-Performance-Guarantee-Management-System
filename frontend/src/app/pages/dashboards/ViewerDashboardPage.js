import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';
function formatCurrency(value) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(num);
}
export default function ViewerDashboardPage() {
    const { user } = useAuth();
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const res = await api.get('/dashboard/stats');
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
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("header", { children: [_jsxs("p", { className: "text-sm uppercase tracking-[0.24em] text-neutral-500", children: ["Welcome back, ", user?.name?.split(' ')[0] ?? 'User'] }), _jsx("h1", { className: "mt-2 text-3xl font-semibold text-neutral-900", children: "Viewer Dashboard" }), _jsx("p", { className: "mt-2 text-sm text-neutral-600", children: "Read-only access to reports and portfolio overview" })] }), _jsx("section", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: statsLoading ? (Array.from({ length: 4 }).map((_, i) => (_jsx("div", { className: "h-32 animate-pulse rounded-3xl bg-neutral-100" }, i)))) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.1em] text-neutral-500", children: "Total Contracts" }), _jsx("p", { className: "mt-4 text-3xl font-semibold text-neutral-900", children: stats?.activeContracts ?? 0 })] }), _jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.1em] text-neutral-500", children: "Active CPGs" }), _jsx("p", { className: "mt-4 text-3xl font-semibold text-neutral-900", children: stats?.activeCpgs ?? 0 })] }), _jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface lg:col-span-2", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.1em] text-neutral-500", children: "Total CPG Value" }), _jsx("p", { className: "mt-4 text-3xl font-semibold text-brand-600", children: formatCurrency(stats?.totalCpgValue ?? 0) })] }), _jsxs("div", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.1em] text-neutral-500", children: "Avg Health Score" }), _jsx("p", { className: "mt-4 text-3xl font-semibold text-neutral-900", children: parseFloat(stats?.avgHealthScore ?? '100').toFixed(1) })] })] })) }), _jsxs("section", { className: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface", children: [_jsx("h2", { className: "mb-6 font-semibold text-neutral-900", children: "Recent Activity" }), _jsx("div", { className: "flex max-h-96 flex-col gap-4 overflow-y-auto", children: activityLoading ? (_jsx("div", { className: "h-32 animate-pulse rounded-3xl bg-neutral-100" })) : activity?.length ? (activity.map((log) => (_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "mt-1 flex h-2 w-2 shrink-0 rounded-full bg-brand-500" }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm text-neutral-900", children: [_jsx("span", { className: "font-medium", children: log.user?.name ?? 'System' }), " ", log.action.toLowerCase(), ' ', _jsx("span", { className: "font-medium", children: log.entityType.toLowerCase() })] }), _jsx("p", { className: "mt-1 text-xs text-neutral-500", children: new Date(log.createdAt).toLocaleString() })] })] }, log.id)))) : (_jsx("div", { className: "flex h-32 items-center justify-center text-sm text-neutral-500", children: "No recent activity" })) })] })] }));
}
