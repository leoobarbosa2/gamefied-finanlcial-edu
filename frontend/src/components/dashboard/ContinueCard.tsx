import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import type { ContinueLesson } from '../../types'

interface ContinueCardProps {
  lesson: ContinueLesson
}

export default function ContinueCard({ lesson }: ContinueCardProps) {
  return (
    <Link
      to={`/lessons/${lesson.lessonId}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-accent-200 bg-accent-50 p-4 transition-colors hover:bg-accent-100 dark:border-accent-800/40 dark:bg-accent-900/10 dark:hover:bg-accent-900/20"
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-1">
          Continuar aprendendo
        </p>
        <p className="font-semibold text-[var(--content-primary)] truncate">{lesson.lessonTitle}</p>
        <p className="mt-0.5 text-sm text-[var(--content-muted)] truncate">{lesson.pathTitle}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-[var(--content-muted)]">
          <Clock className="h-3.5 w-3.5" />
          <span>{lesson.estimatedMins} min</span>
        </div>
      </div>
      <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-white">
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  )
}
