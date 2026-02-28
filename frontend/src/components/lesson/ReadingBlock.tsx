import { motion } from 'framer-motion'
import type { ReadContent } from '../../types'

interface ReadingBlockProps {
  content: ReadContent
}

export default function ReadingBlock({ content }: ReadingBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--content-primary)]">
        {content.heading}
      </h1>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        {content.body.split('\n\n').map((paragraph, i) => {
          // Simple bold parsing: **text**
          const parts = paragraph.split(/\*\*(.*?)\*\*/g)
          return (
            <p key={i} className="text-base leading-relaxed text-[var(--content-secondary)]">
              {parts.map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="font-semibold text-[var(--content-primary)]">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          )
        })}
      </div>

      {content.tip && (
        <div className="rounded-xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-800/40 dark:bg-accent-900/10">
          <p className="text-sm font-medium text-accent-700 dark:text-accent-300 mb-1">Dica</p>
          <p className="text-sm text-accent-600 dark:text-accent-400">{content.tip}</p>
        </div>
      )}
    </motion.div>
  )
}
