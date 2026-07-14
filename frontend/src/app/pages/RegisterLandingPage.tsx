import { useNavigate } from 'react-router-dom'

export default function RegisterLandingPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold">Welcome to POWERGRID — Onboarding</h1>
        <p className="text-sm text-neutral-600 mt-2">Choose the appropriate registration path to get started.</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => navigate('/register/employee')}
          className="w-full rounded-2xl border border-neutral-200 px-6 py-4 text-left hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Register as POWERGRID Employee</p>
              <p className="text-sm text-neutral-500">Quick verification for internal staff</p>
            </div>
            <div className="text-sm text-brand-600">Start</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/register/contractor')}
          className="w-full rounded-2xl border border-neutral-200 px-6 py-4 text-left hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Register as Contractor / Vendor</p>
              <p className="text-sm text-neutral-500">Company onboarding and document upload</p>
            </div>
            <div className="text-sm text-brand-600">Start</div>
          </div>
        </button>

        <div className="mt-6 text-center text-sm text-neutral-500">
          Already submitted an application? <a href="/track/CPG-REG-2026-00124" className="text-brand-600">Track it here</a>
        </div>
      </div>
    </div>
  )
}
