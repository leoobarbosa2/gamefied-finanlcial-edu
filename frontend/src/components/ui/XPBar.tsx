import { motion } from 'framer-motion'

function xpForLevel(n: number) {
  return n * n * 50
}

interface XPBarProps {
  xp: number
  level: number
  animate?: boolean
}

export default function XPBar({ xp, level, animate = true }: XPBarProps) {
  const xpStart = xpForLevel(level - 1)
  const xpEnd = xpForLevel(level)
  const xpInLevel = xp - xpStart
  const xpNeeded = xpEnd - xpStart
  const percent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100))

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[var(--content-secondary)]">Nível {level}</span>
        <span className="text-[var(--content-muted)]">
          {xpInLevel}/{xpNeeded} XP
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--surface-overlay)] overflow-hidden">
        {animate ? (
          <motion.div
            className="h-full rounded-full bg-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ) : (
          <div className="h-full rounded-full bg-accent-500" style={{ width: `${percent}%` }} />
        )}
      </div>
    </div>
  )
}
