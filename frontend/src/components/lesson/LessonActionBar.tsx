import { useLessonStore } from '../../store/lessonStore'
import Button from '../ui/Button'
import type { LessonStep } from '../../types'

interface LessonActionBarProps {
  currentStep: LessonStep | null
  lessonId: string
  onFinish: () => void
}

export default function LessonActionBar({ currentStep, lessonId, onFinish }: LessonActionBarProps) {
  const {
    playerStatus,
    selectedOptionId,
    currentStepIndex,
    totalSteps,
    submitAnswer,
    advanceStep,
  } = useLessonStore()

  const isLastStep = currentStepIndex === totalSteps - 1
  const isAnswered = playerStatus === 'correct' || playerStatus === 'incorrect'
  const isChecking = playerStatus === 'checking'

  const handleAction = async () => {
    if (!currentStep) return

    if (currentStep.stepType === 'QUIZ' && !isAnswered) {
      // Submit the answer
      const question = currentStep.questions[0]
      if (!question || !selectedOptionId) return
      await submitAnswer(lessonId, currentStep.id, question.id)
    } else {
      // Advance or finish
      if (isLastStep) {
        onFinish()
      } else {
        advanceStep()
      }
    }
  }

  const getLabel = () => {
    if (currentStep?.stepType === 'QUIZ' && !isAnswered) return 'Verificar'
    if (isLastStep) return 'Concluir lição'
    return 'Continuar'
  }

  const isDisabled =
    (currentStep?.stepType === 'QUIZ' && !isAnswered && !selectedOptionId) || isChecking

  return (
    <div className="px-4 py-4">
      <Button
        onClick={handleAction}
        disabled={isDisabled}
        loading={isChecking}
        size="lg"
        className="w-full"
        variant={isAnswered && !useLessonStore.getState().answerResult?.isCorrect ? 'secondary' : 'primary'}
      >
        {getLabel()}
      </Button>
    </div>
  )
}
