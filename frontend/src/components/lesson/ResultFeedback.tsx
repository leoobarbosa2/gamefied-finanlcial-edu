import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useLessonStore } from '../../store/lessonStore'
import correctSfx from '../../sound-effects/correct.mp3'
import wrongSfx from '../../sound-effects/wrong.wav'

export default function ResultFeedback() {
  const { playerStatus, answerResult } = useLessonStore()
  const isVisible = playerStatus === 'correct' || playerStatus === 'incorrect'
  const isCorrect = playerStatus === 'correct'

  const correctAudio = useRef(new Audio(correctSfx))
  const wrongAudio = useRef(new Audio(wrongSfx))

  useEffect(() => {
    if (playerStatus === 'correct') {
      correctAudio.current.currentTime = 0
      correctAudio.current.play().catch(() => {})
    } else if (playerStatus === 'incorrect') {
      wrongAudio.current.currentTime = 0
      wrongAudio.current.play().catch(() => {})
    }
  }, [playerStatus])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`border-t px-4 py-4 ${
            isCorrect
              ? 'border-[var(--success)] bg-[var(--success-subtle)]'
              : 'border-[var(--error)] bg-[var(--error-subtle)]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
              ) : (
                <XCircle className="h-5 w-5 text-[var(--error)]" />
              )}
            </div>
            <div>
              <p
                className={`font-semibold ${
                  isCorrect ? 'text-[var(--success-strong)]' : 'text-[var(--error-strong)]'
                }`}
              >
                {isCorrect ? 'Correto!' : 'Não foi desta vez'}
              </p>
              {answerResult?.explanation && (
                <p
                  className={`mt-1 text-sm ${
                    isCorrect ? 'text-[var(--success)]' : 'text-[var(--error)]'
                  }`}
                >
                  {answerResult.explanation}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
