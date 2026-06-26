import { Link } from 'react-router-dom'

export default function ContractsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Contracts</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Portfolio contracts</h1>
        </div>
        <Link
          to="/contracts/new"
          className="inline-flex items-center justify-center rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Create contract
        </Link>
      </div>
      <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-surface">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {['Active', 'Expiring', 'Released', 'Draft'].map((status) => (
            <div key={status} className="rounded-3xl border border-neutral-100 p-4">
              <p className="text-sm font-medium text-neutral-600">{status}</p>
              <p className="mt-3 text-2xl font-semibold text-neutral-900">{Math.floor(Math.random() * 120) + 10}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
