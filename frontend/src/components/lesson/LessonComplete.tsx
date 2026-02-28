import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, BookOpen, Clock, ChevronRight } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLessonStore } from '../../store/lessonStore'
import type { ReadContent } from '../../types'

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

export default function LessonComplete({ lessonTitle, pathSlug, lessonId }: LessonCompleteProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { correctCount, steps, completeLesson, resetLesson, lesson } = useLessonStore()

  const quizSteps = steps.filter((s) => s.stepType === 'QUIZ').length
  const readSteps = steps.filter((s) => s.stepType === 'READ')
  const score = quizSteps > 0 ? Math.round((correctCount / quizSteps) * 100) : 100
  const estimatedSecs = (lesson?.estimatedMins ?? 3) * 60

  const handleDone = async () => {
    await completeLesson(lessonId)
    resetLesson()
    // Invalidate so PathDetail and TopBar reflect the new COMPLETED status immediately
    await queryClient.invalidateQueries({ queryKey: ['path'] })
    await queryClient.invalidateQueries({ queryKey: ['daily-limit'] })
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

      {/* What you learned */}
      {readSteps.length > 0 && (
        <motion.div
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
        transition={{ delay: 0.4 }}
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
