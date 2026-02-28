import { Link } from 'react-router-dom'
import { Clock, CheckCircle2, Circle } from 'lucide-react'
import type { LessonSummary, ProgressStatus } from '../../types'
import { cn } from '../../utils/cn'

interface LessonCardProps {
  lesson: LessonSummary
  pathSlug: string
  dailyLocked?: boolean
  onDailyLocked?: () => void
  isLast?: boolean
}

function StatusDot({ status }: { status: ProgressStatus }) {
  if (status === 'COMPLETED') {
    return <CheckCircle2 className="h-5 w-5 text-accent-500 shrink-0" />
  }
  if (status === 'IN_PROGRESS') {
    return (
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-50" />
        <span className="relative h-3 w-3 rounded-full bg-accent-500" />
      </span>
    )
  }
  return <Circle className="h-5 w-5 text-[var(--border-strong)] shrink-0" />
}

const cardBase = 'flex items-center gap-4 rounded-xl border p-4 transition-colors w-full text-left'

const statusCardClass: Record<ProgressStatus, string> = {
  COMPLETED: `${cardBase} border-[var(--border)] hover:bg-[var(--surface-raised)]`,
  IN_PROGRESS: `${cardBase} border-accent-500/40 bg-accent-50/50 dark:bg-accent-900/10 hover:bg-accent-50 dark:hover:bg-accent-900/20`,
  NOT_STARTED: `${cardBase} border-[var(--border)] hover:bg-[var(--surface-raised)]`,
}

export default function LessonCard({ lesson, onDailyLocked, dailyLocked, isLast }: LessonCardProps) {
  const inner = (
    <>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        <StatusDot status={lesson.status} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn(
          'font-medium truncate',
          lesson.status === 'NOT_STARTED'
            ? 'text-[var(--content-muted)]'
            : 'text-[var(--content-primary)]'
        )}>
          {lesson.title}
        </p>
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

  const cardClass = statusCardClass[lesson.status]

  return (
    <div className="flex flex-col">
      {dailyLocked && lesson.status !== 'COMPLETED' ? (
        <button onClick={onDailyLocked} className={cardClass}>
          {inner}
        </button>
      ) : (
        <Link to={`/lessons/${lesson.id}`} className={cardClass}>
          {inner}
        </Link>
      )}
      {/* Vertical connector */}
      {!isLast && (
        <div className="ml-[1.875rem] w-px h-2 bg-[var(--border)]" />
      )}
    </div>
  )
}
