import { motion } from 'framer-motion'
import QuizOption from './QuizOption'
import { useLessonStore } from '../../store/lessonStore'
import type { Question } from '../../types'

interface QuizBlockProps {
  question: Question
}

export default function QuizBlock({ question }: QuizBlockProps) {
  const { selectedOptionId, playerStatus, answerResult, selectOption } = useLessonStore()
  const isAnswered = playerStatus === 'correct' || playerStatus === 'incorrect'

  const getOptionState = (optionId: string) => {
    if (!isAnswered) {
      return selectedOptionId === optionId ? 'selected' : 'idle'
    }
    if (answerResult?.correctOptionId === optionId) return 'correct'
    if (selectedOptionId === optionId && !answerResult?.isCorrect) return 'incorrect'
    return 'idle'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      <h1 className="text-xl font-semibold leading-snug text-[var(--content-primary)]">
        {question.questionText}
      </h1>

      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => (
          <QuizOption
            key={option.id}
            text={option.text}
            state={getOptionState(option.id)}
            index={i}
            onSelect={() => selectOption(option.id)}
            disabled={isAnswered || playerStatus === 'checking'}
          />
        ))}
      </div>
    </motion.div>
  )
}
