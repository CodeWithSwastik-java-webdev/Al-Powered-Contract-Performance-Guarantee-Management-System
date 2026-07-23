import { Link } from 'react-router-dom'
import DashboardPage from './DashboardPage'

export default function AdminDashboardPage() {
  return <div className="space-y-6">
    <section className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Administrator</p>
      <h1 className="mt-1 text-2xl font-semibold text-neutral-900">Administration dashboard</h1>
      <p className="mt-2 text-sm text-neutral-600">Review registrations, manage users, and monitor the CPG portfolio.</p>
      <div className="mt-4 flex flex-wrap gap-3"><Link to="/dashboard" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Portfolio dashboard</Link><Link to="/contracts" className="rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-800">Manage contracts</Link></div>
    </section>
    <DashboardPage />
  </div>
}
