import { useParams } from 'react-router-dom'

export default function ContractPage() {
  const { id } = useParams()

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Contract detail</p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Contract #{id}</h1>
      </div>
      <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-surface">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-neutral-600">Status</p>
            <p className="mt-2 text-lg font-semibold text-brand-600">Active</p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">Supply group</p>
            <p className="mt-2 text-lg font-semibold text-neutral-900">PG-01</p>
          </div>
        </div>
      </div>
    </div>
  )
}
