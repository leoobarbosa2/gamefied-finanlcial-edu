import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { lessonsApi } from '../api/lessons'
import { useLessonStore } from '../store/lessonStore'
import LessonTopBar from '../components/lesson/LessonTopBar'
import LessonContent from '../components/lesson/LessonContent'
import LessonActionBar from '../components/lesson/LessonActionBar'
import ResultFeedback from '../components/lesson/ResultFeedback'
import LessonComplete from '../components/lesson/LessonComplete'
import Skeleton from '../components/ui/Skeleton'

export default function LessonPlayer() {
  const { id } = useParams<{ id: string }>()
  const { initLesson, steps, currentStepIndex, playerStatus, resetLesson, advanceStep } = useLessonStore()

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonsApi.getOne(id!),
    enabled: !!id,
  })

  // Initialize lesson in store
  useEffect(() => {
    if (lesson) {
      initLesson(lesson)
      lessonsApi.start(lesson.id).catch(console.error)
    }
    return () => {
      resetLesson()
    }
  }, [lesson]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !lesson) {
    return (
      <div className="flex h-screen flex-col bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-2xl flex items-center gap-4 p-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-2 flex-1 rounded-full" />
        </div>
        <div className="mx-auto w-full max-w-2xl flex-1 p-4">
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  const currentStep = steps[currentStepIndex] ?? null

  if (playerStatus === 'complete') {
    return (
      <div className="flex h-screen flex-col bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col">
          <LessonComplete
            lessonTitle={lesson.title}
            pathSlug={lesson.path.slug}
            lessonId={lesson.id}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-2xl">
        <LessonTopBar pathSlug={lesson.path.slug} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6">
          {currentStep && <LessonContent step={currentStep} />}
        </div>
      </div>

      <div className="shrink-0">
        <div className="mx-auto max-w-2xl">
          <ResultFeedback />
          <LessonActionBar
            currentStep={currentStep}
            lessonId={lesson.id}
            onFinish={() => advanceStep()}
          />
        </div>
      </div>
    </div>
  )
}
