import { useAuth } from '../../contexts/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Profile</h1>
        <p className="mt-2 text-sm text-neutral-600">Manage your account settings</p>
      </header>
      <div className="rounded-3xl border border-neutral-200 bg-white p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Name</label>
            <p className="mt-1 text-lg text-neutral-900">{user?.name ?? 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Email</label>
            <p className="mt-1 text-lg text-neutral-900">{user?.email ?? 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Role</label>
            <p className="mt-1 text-lg text-neutral-900">{user?.role ?? 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
