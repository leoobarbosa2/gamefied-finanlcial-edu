import { Flame } from 'lucide-react'

interface WeeklyActivityProps {
  weekActivity: boolean[]
  currentStreak: number
}

// Abbreviated weekday names indexed by getDay() (0 = Sun, 1 = Mon, ...)
const DAY_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Build labels for the rolling 7-day window: index 0 = 6 days ago, index 6 = today
function buildRollingLabels(): string[] {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return DAY_ABBR[d.getDay()]
  })
}

export default function WeeklyActivity({ weekActivity, currentStreak }: WeeklyActivityProps) {
  const hasStreak = currentStreak > 0
  const dayLabels = buildRollingLabels()
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
      <div className="flex items-center gap-1.5">
        {weekActivity.map((active, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`h-7 w-7 rounded-full transition-colors ${
                active
                  ? 'bg-accent-500'
                  : 'bg-[var(--surface-overlay)]'
              }`}
            />
            <span className="text-[10px] text-[var(--content-muted)]">{dayLabels[i]}</span>
          </div>
        ))}
      </div>
      <div className="ml-auto flex flex-col items-end">
        <div className="flex items-center gap-1">
          <Flame className={`h-4 w-4 ${hasStreak ? 'text-amber-500' : 'text-[var(--content-muted)]'}`} />
          <span className={`text-lg font-semibold ${hasStreak ? 'text-[var(--content-primary)]' : 'text-[var(--content-muted)]'}`}>
            {currentStreak}
          </span>
        </div>
        <span className="text-xs text-[var(--content-muted)]">dias seguidos</span>
      </div>
    </div>
  )
}
