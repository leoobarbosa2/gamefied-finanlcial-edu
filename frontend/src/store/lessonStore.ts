import { create } from 'zustand'
import type { Lesson, LessonStep, AnswerResult } from '../types'
import { lessonsApi } from '../api/lessons'

export type PlayerStatus = 'idle' | 'active' | 'checking' | 'correct' | 'incorrect' | 'complete'

interface StepResult {
  stepId: string
  isCorrect?: boolean
  selectedOptionId?: string
}

interface LessonState {
  lesson: Lesson | null
  steps: LessonStep[]
  currentStepIndex: number
  totalSteps: number
  playerStatus: PlayerStatus
  selectedOptionId: string | null
  stepResults: StepResult[]
  answerResult: AnswerResult | null
  correctCount: number

  // Actions
  initLesson: (lesson: Lesson) => void
  selectOption: (optionId: string) => void
  submitAnswer: (lessonId: string, stepId: string, questionId: string) => Promise<void>
  advanceStep: () => void
  completeLesson: (lessonId: string) => Promise<void>
  resetLesson: () => void
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lesson: null,
  steps: [],
  currentStepIndex: 0,
  totalSteps: 0,
  playerStatus: 'idle',
  selectedOptionId: null,
  stepResults: [],
  answerResult: null,
  correctCount: 0,

  initLesson: (lesson) => {
    set({
      lesson,
      steps: lesson.steps,
      currentStepIndex: 0,
      totalSteps: lesson.steps.length,
      playerStatus: 'active',
      selectedOptionId: null,
      stepResults: [],
      answerResult: null,
      correctCount: 0,
    })
  },

  selectOption: (optionId) => {
    if (get().playerStatus !== 'active') return
    set({ selectedOptionId: optionId })
  },

  submitAnswer: async (lessonId, stepId, questionId) => {
    const { selectedOptionId } = get()
    if (!selectedOptionId) return

    set({ playerStatus: 'checking' })

    try {
      const result = await lessonsApi.submitAnswer(lessonId, stepId, {
        questionId,
        selectedOptionId,
      })

      set((state) => ({
        answerResult: result,
        playerStatus: result.isCorrect ? 'correct' : 'incorrect',
        correctCount: result.isCorrect ? state.correctCount + 1 : state.correctCount,
        stepResults: [
          ...state.stepResults,
          { stepId, isCorrect: result.isCorrect, selectedOptionId },
        ],
      }))
    } catch (e) {
      console.error('Failed to submit answer', e)
      set({ playerStatus: 'active' })
    }
  },

  advanceStep: () => {
    const { currentStepIndex, totalSteps } = get()
    const nextIndex = currentStepIndex + 1

    if (nextIndex >= totalSteps) {
      set({ playerStatus: 'complete' })
    } else {
      set({
        currentStepIndex: nextIndex,
        playerStatus: 'active',
        selectedOptionId: null,
        answerResult: null,
      })
    }
  },

  completeLesson: async (lessonId) => {
    const { correctCount, steps } = get()
    const quizSteps = steps.filter((s) => s.stepType === 'QUIZ').length
    const score = quizSteps > 0 ? Math.round((correctCount / quizSteps) * 100) : 100

    try {
      await lessonsApi.complete(lessonId, score)
    } catch (e) {
      console.error('Failed to mark lesson complete', e)
    }
  },

  resetLesson: () =>
    set({
      lesson: null,
      steps: [],
      currentStepIndex: 0,
      totalSteps: 0,
      playerStatus: 'idle',
      selectedOptionId: null,
      stepResults: [],
      answerResult: null,
      correctCount: 0,
    }),
}))
