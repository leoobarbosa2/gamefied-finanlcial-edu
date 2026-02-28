import type { LessonStep, ReadContent, ReflectContent } from '../../types'
import ReadingBlock from './ReadingBlock'
import QuizBlock from './QuizBlock'
import ReflectBlock from './ReflectBlock'

interface LessonContentProps {
  step: LessonStep
}

export default function LessonContent({ step }: LessonContentProps) {
  switch (step.stepType) {
    case 'READ':
      return <ReadingBlock content={step.content as ReadContent} />

    case 'QUIZ': {
      const question = step.questions[0]
      if (!question) return null
      return <QuizBlock question={question} />
    }

    case 'REFLECT':
      return <ReflectBlock content={step.content as ReflectContent} />

    default:
      return null
  }
}
