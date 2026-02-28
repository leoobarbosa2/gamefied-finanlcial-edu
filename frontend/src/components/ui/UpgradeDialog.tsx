import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Sparkles, X } from 'lucide-react'

interface UpgradeDialogProps {
  open: boolean
  onClose: () => void
}

export default function UpgradeDialog({ open, onClose }: UpgradeDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 shadow-xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-[var(--content-muted)] hover:bg-[var(--surface-overlay)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
              <Lock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
            </div>

            {/* Badge */}
            <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 dark:bg-amber-900/30">
              <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">PRO</span>
            </div>

            <h2 className="text-lg font-semibold text-[var(--content-primary)]">
              Trilha exclusiva Pro
            </h2>
            <p className="mt-2 text-sm text-[var(--content-secondary)]">
              Esta trilha é exclusiva para assinantes do plano Pro. Em breve você poderá fazer upgrade para desbloquear todo o conteúdo.
            </p>

            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
            >
              OK, entendi
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
