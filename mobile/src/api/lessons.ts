import client from './client'
import type { Lesson, AnswerResult, DailyLimitStatus, CompleteLessonResult, ApiResponse } from '../types'

export const lessonsApi = {
  getOne: (id: string) =>
    client.get<ApiResponse<Lesson>>(`/lessons/${id}`).then((r) => r.data.data),

  start: (id: string) =>
    client.post<ApiResponse<{ started: boolean }>>(`/lessons/${id}/start`).then((r) => r.data.data),

  complete: (id: string, score?: number) =>
    client
      .post<ApiResponse<CompleteLessonResult>>(`/lessons/${id}/complete`, { score })
      .then((r) => r.data.data),

  getDailyLimit: () =>
    client
      .get<ApiResponse<DailyLimitStatus>>('/lessons/daily-limit')
      .then((r) => r.data.data),

  buySessions: () =>
    client
      .post<ApiResponse<{ newCoins: number; extraSessions: number }>>('/lessons/buy-sessions')
      .then((r) => r.data.data),

  submitAnswer: (
    lessonId: string,
    stepId: string,
    data: { questionId: string; selectedOptionId: string }
  ) =>
    client
      .post<ApiResponse<AnswerResult>>(`/lessons/${lessonId}/steps/${stepId}/answer`, data)
      .then((r) => r.data.data),
}
