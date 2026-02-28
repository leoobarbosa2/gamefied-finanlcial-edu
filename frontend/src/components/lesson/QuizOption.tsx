import { cn } from '../../utils/cn'
import { CheckCircle2, XCircle } from 'lucide-react'

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect'

interface QuizOptionProps {
  text: string
  state: OptionState
  index: number
  onSelect: () => void
  disabled?: boolean
}

export default function QuizOption({ text, state, index, onSelect, disabled }: QuizOptionProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled || state === 'correct' || state === 'incorrect'}
      className={cn(
        'w-full rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
        state === 'idle' &&
          'border-[var(--border)] bg-[var(--surface)] text-[var(--content-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]',
        state === 'selected' &&
          'border-accent-500 bg-accent-50 text-accent-900 ring-1 ring-accent-500 dark:bg-accent-900/20 dark:text-accent-100',
        state === 'correct' &&
          'border-[var(--success)] bg-[var(--success-subtle)] text-[var(--success-strong)]',
        state === 'incorrect' &&
          'border-[var(--error)] bg-[var(--error-subtle)] text-[var(--error-strong)] line-through opacity-70'
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold',
            state === 'idle' && 'bg-[var(--surface-overlay)] text-[var(--content-muted)]',
            state === 'selected' && 'bg-accent-500 text-white',
            state === 'correct' && 'bg-[var(--success)] text-white',
            state === 'incorrect' && 'bg-[var(--error)] text-white'
          )}
        >
          {state === 'correct' ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : state === 'incorrect' ? (
            <XCircle className="h-3.5 w-3.5" />
          ) : (
            String.fromCharCode(65 + index) // A, B, C, D
          )}
        </span>
        <span className="flex-1">{text}</span>
      </div>
    </button>
  )
}
