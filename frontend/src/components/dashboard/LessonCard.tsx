import { Link } from 'react-router-dom'
import { Clock, CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import type { LessonSummary, ProgressStatus } from '../../types'
import { cn } from '../../utils/cn'

interface LessonCardProps {
  lesson: LessonSummary
  pathSlug: string
  dailyLocked?: boolean
  onDailyLocked?: () => void
}

const statusConfig: Record<ProgressStatus, { icon: typeof CheckCircle2; className: string }> = {
  COMPLETED: { icon: CheckCircle2, className: 'text-accent-500' },
  IN_PROGRESS: { icon: PlayCircle, className: 'text-amber-500' },
  NOT_STARTED: { icon: Circle, className: 'text-[var(--border-strong)]' },
}

const cardClass = 'flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--surface-raised)] w-full text-left'

export default function LessonCard({ lesson, onDailyLocked, dailyLocked }: LessonCardProps) {
  const config = statusConfig[lesson.status]
  const StatusIcon = config.icon

  const inner = (
    <>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        <StatusIcon className={cn('h-5 w-5', config.className)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[var(--content-primary)] truncate">{lesson.title}</p>
        {lesson.description && (
          <p className="mt-0.5 text-sm text-[var(--content-muted)] truncate">{lesson.description}</p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-1 text-xs text-[var(--content-muted)]">
        <Clock className="h-3.5 w-3.5" />
        <span>{lesson.estimatedMins}m</span>
      </div>
    </>
  )

  if (dailyLocked && lesson.status !== 'COMPLETED') {
    return (
      <button onClick={onDailyLocked} className={cardClass}>
        {inner}
      </button>
    )
  }

  return (
    <Link to={`/lessons/${lesson.id}`} className={cardClass}>
      {inner}
    </Link>
  )
}
