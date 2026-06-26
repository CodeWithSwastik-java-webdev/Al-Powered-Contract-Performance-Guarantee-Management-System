import { Outlet } from 'react-router-dom'
import Sidebar from '../../shared/components/layout/Sidebar'
import TopNav from '../../shared/components/layout/TopNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-neutral-900">
      <div className="flex">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopNav />
          <main className="flex-1 px-6 py-6 xl:px-10 xl:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
