import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, BookOpen, Clock, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLessonStore } from '../../store/lessonStore'
import { useAuthStore } from '../../store/authStore'
import XPBar from '../ui/XPBar'
import CoinsBadge from '../ui/CoinsBadge'
import type { ReadContent, CompleteLessonResult } from '../../types'

interface LessonCompleteProps {
  lessonTitle: string
  pathSlug: string
  lessonId: string
}

function ScoreRing({ score }: { score: number }) {
  const size = 120
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (circumference * score) / 100

  const color =
    score >= 80 ? '#14b8a6' :
    score >= 50 ? '#f59e0b' :
    '#f43f5e'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--surface-overlay)" strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.p
          className="text-2xl font-bold leading-none text-[var(--content-primary)]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          {score}%
        </motion.p>
      </div>
    </div>
  )
}

function formatTime(secs: number): string {
  if (secs < 60) return `${secs}s`
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function AnimatedCounter({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === 0) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return <>{value}</>
}

export default function LessonComplete({ lessonTitle, pathSlug, lessonId }: LessonCompleteProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { correctCount, steps, completeLesson, resetLesson, lesson } = useLessonStore()
  const { user, updateUser } = useAuthStore()
  const [reward, setReward] = useState<CompleteLessonResult | null>(null)
  const hasFired = useRef(false)

  const quizSteps = steps.filter((s) => s.stepType === 'QUIZ').length
  const readSteps = steps.filter((s) => s.stepType === 'READ')
  const score = quizSteps > 0 ? Math.round((correctCount / quizSteps) * 100) : 100
  const estimatedSecs = (lesson?.estimatedMins ?? 3) * 60

  // Call completeLesson once on mount if this is a first completion
  useEffect(() => {
    if (hasFired.current) return
    const wasAlreadyCompleted = lesson?.progress?.status === 'COMPLETED'
    if (wasAlreadyCompleted) return
    hasFired.current = true

    completeLesson(lessonId).then((result) => {
      if (result) {
        setReward(result)
        queryClient.invalidateQueries({ queryKey: ['daily-limit'] })
        // Update authStore so TopBar XP bar reflects immediately
        updateUser({
          xp: result.newXp,
          level: result.newLevel,
          coins: (user?.coins ?? 0) + result.coinsEarned,
        })
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDone = async () => {
    resetLesson()
    await queryClient.invalidateQueries({ queryKey: ['path'] })
    navigate(`/paths/${pathSlug}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 px-4 py-10 max-w-lg mx-auto w-full"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col items-center gap-3 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
          <CheckCircle2 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--content-muted)]">
            Lição concluída
          </p>
          <h1 className="mt-1 text-xl font-semibold text-[var(--content-primary)]">{lessonTitle}</h1>
        </div>
      </motion.div>

      {/* Score + stats */}
      <motion.div
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-around gap-4">
          {quizSteps > 0 ? (
            <div className="flex flex-col items-center gap-2">
              <ScoreRing score={score} />
              <p className="text-sm text-[var(--content-muted)]">
                {correctCount} de {quizSteps} corretas
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                <CheckCircle2 className="h-10 w-10 text-teal-500" />
              </div>
              <p className="text-sm text-[var(--content-muted)]">Concluída</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-overlay)]">
                <BookOpen className="h-4 w-4 text-[var(--content-muted)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--content-muted)]">Passos</p>
                <p className="text-sm font-semibold text-[var(--content-primary)]">{steps.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-overlay)]">
                <Clock className="h-4 w-4 text-[var(--content-muted)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--content-muted)]">Estimado</p>
                <p className="text-sm font-semibold text-[var(--content-primary)]">{formatTime(estimatedSecs)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rewards */}
      <AnimatePresence>
        {reward && reward.xpEarned > 0 && (
          <motion.div
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 flex flex-col gap-4"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--content-muted)]">
              Recompensas
            </p>

            <div className="flex items-center justify-around gap-4">
              {/* XP earned */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-accent-500" />
                  <span className="text-2xl font-bold text-accent-500">
                    +<AnimatedCounter target={reward.xpEarned} duration={800} />
                  </span>
                </div>
                <p className="text-xs text-[var(--content-muted)]">XP</p>
              </div>

              {/* Coins earned */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-amber-500">
                    +<AnimatedCounter target={reward.coinsEarned} duration={800} />
                  </span>
                </div>
                <CoinsBadge coins={reward.coinsEarned} />
              </div>
            </div>

            {/* XP Bar post-lesson */}
            <XPBar xp={reward.newXp} level={reward.newLevel} />

            {/* Level up banner */}
            {reward.leveledUp && (
              <motion.div
                className="flex items-center gap-3 rounded-xl bg-accent-500/10 border border-accent-500/30 px-4 py-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              >
                <TrendingUp className="h-5 w-5 text-accent-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-accent-600 dark:text-accent-400">
                    Nível {reward.newLevel}!
                  </p>
                  <p className="text-xs text-[var(--content-muted)]">
                    Você subiu de nível — continue assim!
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* What you learned */}
      {readSteps.length > 0 && (
        <motion.div
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--content-muted)]">
            O que você aprendeu
          </p>
          <ul className="flex flex-col gap-2">
            {readSteps.map((step) => {
              const heading = (step.content as ReadContent).heading
              return (
                <li key={step.id} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                  <span className="text-sm text-[var(--content-secondary)]">{heading}</span>
                </li>
              )
            })}
          </ul>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleDone}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
        >
          Voltar para a trilha
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  )
}
