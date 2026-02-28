import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flame, BookOpen, Clock, Bell, BellOff, Check, Coins } from 'lucide-react'

interface DailyLimitDialogProps {
  open: boolean
  onClose: () => void
  resetAt?: string
  currentStreak?: number
  coins?: number
  onBuySessions?: () => void
  isBuyingSessions?: boolean
}

function formatResetTime(resetAt?: string): string {
  if (!resetAt) return '00:00'
  const d = new Date(resetAt)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function scheduleNotification(resetAt?: string) {
  if (!resetAt) return
  const resetDate = new Date(resetAt)
  const delayMs = resetDate.getTime() - Date.now()
  if (delayMs <= 0) return
  setTimeout(() => {
    new Notification('Finlearn — Novas sessões disponíveis! 🎓', {
      body: 'Suas sessões diárias foram renovadas. Continue sua jornada de aprendizado!',
      icon: '/favicon.svg',
    })
  }, delayMs)
}

type NotifState = 'idle' | 'granted' | 'denied' | 'unsupported'

function NotificationButton({ resetAt }: { resetAt?: string }) {
  const [state, setState] = useState<NotifState>(() => {
    if (!('Notification' in window)) return 'unsupported'
    if (Notification.permission === 'granted') return 'granted'
    if (Notification.permission === 'denied') return 'denied'
    return 'idle'
  })

  const handleClick = async () => {
    if (state !== 'idle') return
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      scheduleNotification(resetAt)
      setState('granted')
    } else {
      setState('denied')
    }
  }

  if (state === 'unsupported') return null

  if (state === 'granted') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/15">
        <Check className="h-4 w-4 shrink-0 text-emerald-500" />
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Você será avisado quando as sessões renovarem!
        </p>
      </div>
    )
  }

  if (state === 'denied') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-raised)] px-4 py-3">
        <BellOff className="h-4 w-4 shrink-0 text-[var(--content-muted)]" />
        <p className="text-xs text-[var(--content-muted)]">
          Notificações bloqueadas. Ative nas configurações do navegador para ser avisado.
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] py-3 text-sm font-medium text-[var(--content-secondary)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--content-primary)] active:scale-[0.98]"
    >
      <Bell className="h-4 w-4" />
      Ativar notificações
    </button>
  )
}

export default function DailyLimitDialog({
  open,
  onClose,
  resetAt,
  currentStreak = 0,
  coins = 0,
  onBuySessions,
  isBuyingSessions = false,
}: DailyLimitDialogProps) {
  const isStreak = currentStreak >= 3
  const canBuyWithCoins = coins >= 100

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-x-4 bottom-0 z-50 mx-auto max-w-md pb-6 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:pb-0"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          >
            <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden">
              <div className={`h-1 w-full ${isStreak ? 'bg-amber-400' : 'bg-accent-500'}`} />

              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-1 text-[var(--content-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--content-primary)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="px-6 pb-6 pt-5 flex flex-col gap-4">
                {isStreak ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
                        <Flame className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-amber-500">
                          {currentStreak} dias seguidos
                        </p>
                        <h2 className="text-lg font-semibold text-[var(--content-primary)]">
                          Você manteve a consistência!
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--content-muted)]">
                      Pequenos passos criam grandes resultados. Você completou suas sessões de hoje — volte amanhã para continuar evoluindo!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-900/30">
                        <BookOpen className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-teal-600 dark:text-teal-400">
                          3 de 3 sessões
                        </p>
                        <h2 className="text-lg font-semibold text-[var(--content-primary)]">
                          Sessões de hoje concluídas!
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--content-muted)]">
                      O aprendizado funciona melhor em pequenas doses diárias. Ative as notificações e te avisaremos quando puder voltar a aprender!
                    </p>
                  </>
                )}

                <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-raised)] px-3 py-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-[var(--content-muted)]" />
                  <p className="text-sm text-[var(--content-muted)]">
                    Novas sessões disponíveis às{' '}
                    <span className="font-semibold text-[var(--content-primary)]">
                      {formatResetTime(resetAt)}
                    </span>
                  </p>
                </div>

                <button
                  onClick={onBuySessions}
                  disabled={!canBuyWithCoins || isBuyingSessions}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors active:scale-[0.98] ${
                    canBuyWithCoins
                      ? 'border-amber-300 bg-amber-50 hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-900/20 dark:hover:bg-amber-900/30'
                      : 'border-[var(--border)] bg-[var(--surface-raised)] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                    <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--content-primary)]">
                      {isBuyingSessions ? 'Processando…' : 'Usar 100 coins para +3 sessões'}
                    </p>
                    <p className="text-xs text-[var(--content-muted)]">
                      {canBuyWithCoins
                        ? `Você tem ${coins} coins disponíveis`
                        : `Você tem ${coins} coins — precisa de 100`}
                    </p>
                  </div>
                </button>

                <NotificationButton resetAt={resetAt} />

                <button
                  onClick={onClose}
                  className="w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
                >
                  OK, entendi
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
