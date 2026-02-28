import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raised'
}

export default function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border)] transition-colors',
        variant === 'raised' ? 'bg-[var(--surface-raised)]' : 'bg-[var(--surface)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
