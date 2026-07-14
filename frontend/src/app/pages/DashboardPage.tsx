import { useQuery } from '@tanstack/react-query'
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../lib/api'

// ── Types ──────────────────────────────────────────────────────────────────
interface DashboardStats {
  activeContracts: number
  activeCpgs: number
  totalCpgValue: string
  avgHealthScore: string
  expiringSoon: number
  activeAnomalies: number
}

interface Activity {
  id: string
  action: string
  entityType: string
  createdAt: string
  user?: { name: string; role: string }
}

interface ChartData {
  riskDistribution: { name: string; value: number }[]
  statusBreakdown: { name: string; value: number }[]
  monthlyExpirations: { name: string; value: number }[]
}

const RISK_COLORS = {
  LOW: '#4ADE80',
  MEDIUM: '#FBBF24',
  HIGH: '#F97316',
  CRITICAL: '#EF4444',
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#3B82F6',
  SUBMITTED: '#A855F7',
  VERIFIED: '#F59E0B',
  RELEASED: '#10B981',
  EXPIRED: '#EF4444',
}

// ── Components ─────────────────────────────────────────────────────────────
function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

function LoadingCard() {
  return (
    <div className="h-full w-full animate-pulse rounded-3xl bg-neutral-100 p-6" />
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats')
      return res.data.data as DashboardStats
    },
  })

  const { data: charts, isLoading: chartsLoading } = useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: async () => {
      const res = await api.get('/dashboard/charts')
      return res.data.data as ChartData
    },
  })

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      const res = await api.get('/dashboard/recent-activity')
      return res.data.data as Activity[]
    },
  })

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">
            Welcome back, {user?.name?.split(' ')[0] ?? 'User'}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
            CPG portfolio overview
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/cpgs?filter=expiring-soon"
            className="rounded-3xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400"
          >
            View expiring
          </Link>
          <Link
            to="/ai-risk"
            className="rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            AI summary
          </Link>
        </div>
      </header>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)
        ) : (
          <>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500 truncate">Total Contracts</p>
              <p className="mt-4 text-3xl font-semibold text-neutral-900">{stats?.activeContracts ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500 truncate">Active CPGs</p>
              <p className="mt-4 text-3xl font-semibold text-neutral-900">{stats?.activeCpgs ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface sm:col-span-2 xl:col-span-2">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500 truncate">Total CPG Value</p>
              <p className="mt-4 text-3xl font-semibold text-brand-600 truncate">{formatCurrency(stats?.totalCpgValue ?? 0)}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500 truncate">Avg Health</p>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-3xl font-semibold text-neutral-900">
                  {parseFloat(stats?.avgHealthScore ?? '100').toFixed(1)}
                </p>
                <span className="mb-1 text-sm text-neutral-500">/ 100</span>
              </div>
            </div>
            <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-red-600 truncate">Anomalies</p>
              <p className="mt-4 text-3xl font-semibold text-red-700">{stats?.activeAnomalies ?? 0}</p>
            </div>
          </>
        )}
      </section>

      {/* ── Charts & Activity ───────────────────────────────────────────── */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Risk Distribution */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface xl:col-span-1">
          <h2 className="mb-6 font-semibold text-neutral-900">Risk Distribution</h2>
          <div className="h-64">
            {chartsLoading ? (
              <LoadingCard />
            ) : charts?.riskDistribution.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.riskDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] || '#D1D5DB'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">No risk data available</div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            {Object.keys(RISK_COLORS).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: RISK_COLORS[key as keyof typeof RISK_COLORS] }} />
                <span className="text-neutral-600">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown (Area Chart for fake trend or Bar for actual) - Let's use Area for Expirations */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface xl:col-span-1">
          <h2 className="mb-6 font-semibold text-neutral-900">Monthly Expirations</h2>
          <div className="h-64">
            {chartsLoading ? (
              <LoadingCard />
            ) : charts?.monthlyExpirations.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.monthlyExpirations}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8E6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2D6A4F" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">No expiration data</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface xl:col-span-1">
          <h2 className="mb-6 font-semibold text-neutral-900">Recent Activity</h2>
          <div className="flex h-64 flex-col gap-4 overflow-y-auto pr-2">
            {activityLoading ? (
              <LoadingCard />
            ) : activity?.length ? (
              activity.map((log) => (
                <div key={log.id} className="flex gap-4">
                  <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <p className="text-sm text-neutral-900">
                      <span className="font-medium">{log.user?.name ?? 'System'}</span> {log.action.toLowerCase()}{' '}
                      <span className="font-medium">{log.entityType.toLowerCase()}</span>
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">No recent activity</div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
