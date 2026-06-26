import { Bell, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../../contexts/ThemeContext'

export default function TopNav() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-white/80 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="text-sm text-neutral-500">Dashboard</div>
      </div>
      <div className="flex items-center gap-3">
        <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300">
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={toggleTheme}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
