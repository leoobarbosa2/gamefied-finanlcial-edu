import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import ProgressBar from '../progress/ProgressBar'
import { useLessonStore } from '../../store/lessonStore'

interface LessonTopBarProps {
  pathSlug: string
}

export default function LessonTopBar({ pathSlug }: LessonTopBarProps) {
  const navigate = useNavigate()
  const { currentStepIndex, totalSteps } = useLessonStore()
  const progress = totalSteps > 0 ? ((currentStepIndex) / totalSteps) * 100 : 0

  const handleClose = () => {
    navigate(`/paths/${pathSlug}`)
  }

  return (
    <header className="flex items-center gap-4 px-4 py-3">
      <button
        onClick={handleClose}
        aria-label="Exit lesson"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--content-muted)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--content-primary)]"
      >
        <X className="h-5 w-5" />
      </button>
      <ProgressBar value={progress} className="flex-1" />
      <span className="w-12 shrink-0 text-right text-xs font-medium text-[var(--content-muted)]">
        {currentStepIndex + 1}/{totalSteps}
      </span>
    </header>
  )
}
