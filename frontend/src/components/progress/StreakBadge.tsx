import { Flame } from 'lucide-react'
import { cn } from '../../utils/cn'

interface StreakBadgeProps {
  count: number
  isActive?: boolean
  className?: string
}

export default function StreakBadge({ count, isActive = true, className }: StreakBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium',
        isActive
          ? 'text-accent-600 dark:text-accent-400'
          : 'text-[var(--content-muted)]',
        className
      )}
    >
      <Flame className="h-4 w-4" />
      <span>{count}</span>
    </div>
  )
}
