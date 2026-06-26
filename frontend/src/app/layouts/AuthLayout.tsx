import { ReactNode } from 'react'
import PowergridLogo from '../../shared/components/layout/PowergridLogo'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(115,171,140,0.18),_transparent_50%),linear-gradient(180deg,#F6FBF8_0%,#F4F6F5_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-2xl flex-col justify-center gap-8">
        <div className="flex justify-center">
          <PowergridLogo className="h-12" />
        </div>
        <div className="rounded-[32px] border border-white/70 bg-white/85 p-10 shadow-surface backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  )
}
