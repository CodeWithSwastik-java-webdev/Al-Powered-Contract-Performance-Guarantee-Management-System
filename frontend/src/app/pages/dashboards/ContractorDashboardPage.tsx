import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import api from '../../../lib/api'

interface DashboardStats {
  activeContracts: number
  activeCpgs: number
  expiringSoon: number
  totalCpgValue: string
  profileComplete?: boolean
  contractorId?: string
}

interface Activity {
  id: string
  action: string
  entityType: string
  createdAt: string
  user?: { name: string; role: string }
}

function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

export default function ContractorDashboardPage() {
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
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">
            Welcome back, {user?.name?.split(' ')[0] ?? 'User'}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
            Contractor Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/contractor/contracts"
            className="rounded-3xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400"
          >
            My Contracts
          </Link>
          <Link
            to="/profile"
            className="rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Update Profile
          </Link>
        </div>
      </header>

      {!stats?.profileComplete && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-800">Complete Your Profile</p>
          <p className="mt-1 text-sm text-amber-700">Please complete your profile to access all features.</p>
          <Link to="/profile" className="mt-3 inline-block rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700">
            Complete Profile
          </Link>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-neutral-100" />
          ))
        ) : (
          <>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500">My Contracts</p>
              <p className="mt-4 text-3xl font-semibold text-neutral-900">{stats?.activeContracts ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500">My CPGs</p>
              <p className="mt-4 text-3xl font-semibold text-neutral-900">{stats?.activeCpgs ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface lg:col-span-2">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-neutral-500">Total CPG Value</p>
              <p className="mt-4 text-3xl font-semibold text-brand-600">{formatCurrency(stats?.totalCpgValue ?? 0)}</p>
            </div>
            <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-red-600">Expiring Soon</p>
              <p className="mt-4 text-3xl font-semibold text-red-700">{stats?.expiringSoon ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-green-100 bg-green-50 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-green-700">Profile Status</p>
              <p className="mt-4 text-3xl font-semibold text-green-800">
                {stats?.profileComplete ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          </>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
          <h2 className="mb-6 font-semibold text-neutral-900">Recent Activity</h2>
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
              <div className="flex h-32 items-center justify-center text-sm text-neutral-500">No recent activity</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
          <h2 className="mb-6 font-semibold text-neutral-900">Quick Actions</h2>
          <div className="grid gap-3">
            <Link to="/contractor/contracts" className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
              View My Contracts
            </Link>
            <Link to="/contractor/cpgs" className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
              View My CPGs
            </Link>
            <Link to="/contractor/documents" className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
              My Documents
            </Link>
            <Link to="/support" className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
              Get Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
