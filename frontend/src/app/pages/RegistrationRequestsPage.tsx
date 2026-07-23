export default function RegistrationRequestsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Registration Requests</h1>
        <p className="mt-2 text-sm text-neutral-600">Review and approve pending registration requests</p>
      </header>
      <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center">
        <p className="text-neutral-500">No pending registration requests</p>
      </div>
    </div>
  )
}
