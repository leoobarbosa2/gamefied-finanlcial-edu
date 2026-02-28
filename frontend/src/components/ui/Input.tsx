import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--content-primary)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-lg border bg-[var(--surface)] px-3 text-sm text-[var(--content-primary)] placeholder:text-[var(--content-muted)] transition-colors',
            'focus:outline-2 focus:outline-offset-0 focus:outline-accent-500',
            error
              ? 'border-[var(--error)] focus:outline-[var(--error)]'
              : 'border-[var(--border)] hover:border-[var(--border-strong)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--content-muted)]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
