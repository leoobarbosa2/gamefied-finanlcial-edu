import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  size?: 'sm' | 'md'
  color?: string // Tailwind class e.g. 'bg-indigo-500'
}

export default function ProgressBar({ value, className, size = 'md', color }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'w-full overflow-hidden rounded-full bg-[var(--surface-overlay)]',
        size === 'sm' ? 'h-1.5' : 'h-2',
        className
      )}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500 ease-out', color ?? 'bg-accent-500')}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
