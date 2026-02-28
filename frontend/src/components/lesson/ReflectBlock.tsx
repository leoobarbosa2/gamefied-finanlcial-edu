import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ReflectContent } from '../../types'

interface ReflectBlockProps {
  content: ReflectContent
}

export default function ReflectBlock({ content }: ReflectBlockProps) {
  const [text, setText] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">
          Reflexão
        </p>
        <h1 className="text-xl font-semibold leading-snug text-[var(--content-primary)]">
          {content.prompt}
        </h1>
      </div>

      {content.hint && (
        <p className="text-sm text-[var(--content-muted)] italic">{content.hint}</p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escreva seus pensamentos aqui... (opcional)"
        rows={5}
        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--content-primary)] placeholder:text-[var(--content-muted)] transition-colors focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
      />

      <p className="text-xs text-[var(--content-muted)]">
        Suas reflexões são privadas e não são salvas em nossos servidores.
      </p>
    </motion.div>
  )
}
