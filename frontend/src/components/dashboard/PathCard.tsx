import { Link } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import { type LucideProps, Lock } from 'lucide-react'
import Card from '../ui/Card'
import CompletionRing from '../progress/CompletionRing'
import type { LearningPath } from '../../types'

interface PathCardProps {
  path: LearningPath
  isPremiumLocked?: boolean
  onPremiumLocked?: () => void
}

type IconName = keyof typeof LucideIcons

const colorConfig: Record<string, { bg: string; icon: string; ring: string }> = {
  teal:   { bg: 'bg-teal-50 dark:bg-teal-900/20',   icon: 'text-teal-600 dark:text-teal-400',   ring: '#14b8a6' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', ring: '#6366f1' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',  icon: 'text-amber-600 dark:text-amber-400',  ring: '#f59e0b' },
  rose:   { bg: 'bg-rose-50 dark:bg-rose-900/20',    icon: 'text-rose-600 dark:text-rose-400',    ring: '#f43f5e' },
}
const defaultColor = colorConfig.teal

function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const pascalName = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') as IconName

  const Icon = LucideIcons[pascalName] as React.ComponentType<LucideProps> | undefined
  if (!Icon) return <LucideIcons.BookOpen {...props} />
  return <Icon {...props} />
}

export default function PathCard({ path, isPremiumLocked, onPremiumLocked }: PathCardProps) {
  const colors = colorConfig[path.colorToken] ?? defaultColor

  const cardContent = (
    <Card
      className={`flex items-center gap-4 p-4 transition-colors hover:bg-[var(--surface-raised)] ${isPremiumLocked ? 'opacity-60' : ''}`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}>
        <DynamicIcon name={path.iconName} className={`h-5 w-5 ${colors.icon}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[var(--content-primary)] truncate">{path.title}</p>
          {isPremiumLocked && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Lock className="h-2.5 w-2.5" />
              PRO
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-[var(--content-muted)] truncate">{path.description}</p>
        <p className="mt-1 text-xs text-[var(--content-muted)]">
          {path.completedLessons}/{path.totalLessons} lições
        </p>
      </div>

      {isPremiumLocked
        ? <Lock className="h-5 w-5 shrink-0 text-amber-500" />
        : <CompletionRing percentage={path.completionPct} size={44} color={colors.ring} />
      }
    </Card>
  )

  if (isPremiumLocked) {
    return (
      <button className="w-full text-left" onClick={onPremiumLocked}>
        {cardContent}
      </button>
    )
  }

  return <Link to={`/paths/${path.slug}`}>{cardContent}</Link>
}
