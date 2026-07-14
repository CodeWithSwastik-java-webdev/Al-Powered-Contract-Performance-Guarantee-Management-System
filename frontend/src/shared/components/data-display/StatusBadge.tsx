import { cn } from '../../utils/classnames'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusStyles: Record<string, string> = {
  // Contract Statuses
  DRAFT: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  ACTIVE: 'bg-brand-50 text-brand-700 border-brand-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  TERMINATED: 'bg-red-50 text-red-700 border-red-200',
  SUSPENDED: 'bg-amber-50 text-amber-700 border-amber-200',

  // Additional CPG Statuses
  REQUIRED: 'bg-orange-50 text-orange-700 border-orange-200',
  SUBMITTED: 'bg-purple-50 text-purple-700 border-purple-200',
  VERIFIED: 'bg-blue-50 text-blue-700 border-blue-200',
  EXPIRED: 'bg-red-50 text-red-700 border-red-200',
  CLAIMED: 'bg-rose-50 text-rose-700 border-rose-200',
  INVOKED: 'bg-red-100 text-red-800 border-red-300',
  RELEASED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  RENEWED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  CANCELLED: 'bg-neutral-100 text-neutral-600 border-neutral-200',

  // Fallback
  DEFAULT: 'bg-neutral-100 text-neutral-700 border-neutral-200',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.DEFAULT

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        style,
        className,
      )}
    >
      {status}
    </span>
  )
}
