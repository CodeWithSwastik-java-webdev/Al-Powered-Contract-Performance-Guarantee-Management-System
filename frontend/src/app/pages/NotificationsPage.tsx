export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Notifications</h1>
        <p className="mt-2 text-sm text-neutral-600">View your notifications and alerts</p>
      </header>
      <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center">
        <p className="text-neutral-500">No notifications at this time</p>
      </div>
    </div>
  )
}
