import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../../contexts/AuthContext'
import api from '../../../lib/api'

interface DashboardStats {
  activeContracts: number
  activeCpgs: number
  avgHealthScore: string
  activeAnomalies: number
}

interface Activity {
  id: string
  action: string
  entityType: string
  createdAt: string
  user?: { name: string; role: string }
}

export default function AuditorDashboardPage() {
  const { user } = useAuth()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats')
      return res.data.data as DashboardStats
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
      <header>
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">
          Welcome back, {user?.name?.split(' ')[0] ?? 'User'}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
          Auditor Dashboard
        </h1>
        <p className="mt-2 text-sm text-neutral-600">Read-only access to audit logs and compliance status</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-neutral-100" />
          ))
        ) : (
          <>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500">Active Contracts</p>
              <p className="mt-4 text-3xl font-semibold text-neutral-900">{stats?.activeContracts ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500">Active CPGs</p>
              <p className="mt-4 text-3xl font-semibold text-neutral-900">{stats?.activeCpgs ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500">Avg Health Score</p>
              <p className="mt-4 text-3xl font-semibold text-neutral-900">
                {parseFloat(stats?.avgHealthScore ?? '100').toFixed(1)}
              </p>
            </div>
            <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-red-600">Detected Anomalies</p>
              <p className="mt-4 text-3xl font-semibold text-red-700">{stats?.activeAnomalies ?? 0}</p>
            </div>
          </>
        )}
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
        <h2 className="mb-6 font-semibold text-neutral-900">Audit Logs</h2>
        <div className="flex max-h-96 flex-col gap-4 overflow-y-auto">
          {activityLoading ? (
            <div className="h-32 animate-pulse rounded-3xl bg-neutral-100" />
          ) : activity?.length ? (
            activity.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <div>
                  <p className="text-sm text-neutral-900">
                    <span className="font-medium">{log.user?.name ?? 'System'}</span> {log.action.toLowerCase()}{' '}
                    <span className="font-medium">{log.entityType.toLowerCase()}</span>
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-neutral-500">No audit logs available</div>
          )}
        </div>
      </section>
    </div>
  )
}
