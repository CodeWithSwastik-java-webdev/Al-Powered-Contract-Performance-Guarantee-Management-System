export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Welcome back, Col. Sharma</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">CPG portfolio overview</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-3xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400">View expiring</button>
          <button className="rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">AI summary</button>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-6">
        {[
          { label: 'Total contracts', value: '248' },
          { label: 'Active CPGs', value: '412' },
          { label: 'Expiring soon', value: '23' },
          { label: 'Released', value: '89' },
          { label: 'Invoked', value: '4' },
          { label: 'Avg health', value: '82.4' },
        ].map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-surface">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-neutral-500">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold text-neutral-900">{metric.value}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
