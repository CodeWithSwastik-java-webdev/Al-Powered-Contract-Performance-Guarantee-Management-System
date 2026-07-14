import { useParams } from 'react-router-dom'

export default function TrackingPage() {
  const { appId } = useParams()

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-xl font-semibold mb-4">Application Tracking</h1>
      <div className="p-6 border rounded bg-white">
        <div className="mb-4">
          <div className="text-sm text-neutral-500">Application ID</div>
          <div className="font-mono mt-1">{appId ?? 'CPG-REG-2026-00124'}</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-neutral-500">Status</div>
          <div className="font-medium mt-1 text-yellow-600">Pending Review</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-neutral-500">Current Stage</div>
          <div className="mt-1">Verification</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-neutral-500">Estimated Review Time</div>
          <div className="mt-1">2 Working Days</div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Timeline</h3>
          <ol className="space-y-3">
            <li>2026-06-20 — Submitted</li>
            <li>2026-06-21 — Initial Validation</li>
            <li>2026-06-22 — Verification (In progress)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
