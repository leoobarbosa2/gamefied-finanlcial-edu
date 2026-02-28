import client from './client'
import type { ApiResponse } from '../types'

export interface AdminMetrics {
  totalUsers: number
  totalCompleted: number
  totalPaths: number
  weeklyCompletions: number
  popularPaths: { id: string; title: string; completions: number }[]
}

export interface AdminPath {
  id: string
  slug: string
  title: string
  description: string
  iconName: string
  colorToken: string
  orderIndex: number
  isPublished: boolean
  isPremium: boolean
  totalLessons: number
}

export interface AdminLesson {
  id: string
  pathId: string
  title: string
  description: string | null
  orderIndex: number
  estimatedMins: number
  isPublished: boolean
  _count: { steps: number }
}

export interface AdminOption {
  id: string
  questionId: string
  text: string
  isCorrect: boolean
  orderIndex: number
}

export interface AdminQuestion {
  id: string
  stepId: string
  questionText: string
  explanation: string | null
  options: AdminOption[]
}

export interface AdminStep {
  id: string
  lessonId: string
  stepType: 'READ' | 'QUIZ' | 'REFLECT'
  orderIndex: number
  content: Record<string, unknown>
  questions: AdminQuestion[]
}

export interface AdminUser {
  id: string
  email: string
  displayName: string
  plan: 'FREE' | 'PRO'
  role: 'STUDENT' | 'ADMIN'
  createdAt: string
}

export const adminApi = {
  getMetrics: () =>
    client.get<ApiResponse<AdminMetrics>>('/admin/metrics').then((r) => r.data.data),

  // Paths
  getPaths: () =>
    client.get<ApiResponse<AdminPath[]>>('/admin/paths').then((r) => r.data.data),

  createPath: (data: Partial<AdminPath>) =>
    client.post<ApiResponse<AdminPath>>('/admin/paths', data).then((r) => r.data.data),

  updatePath: (id: string, data: Partial<AdminPath>) =>
    client.patch<ApiResponse<AdminPath>>(`/admin/paths/${id}`, data).then((r) => r.data.data),

  deletePath: (id: string) =>
    client.delete(`/admin/paths/${id}`).then((r) => r.data),

  // Lessons
  getLessons: (pathId: string) =>
    client.get<ApiResponse<AdminLesson[]>>(`/admin/paths/${pathId}/lessons`).then((r) => r.data.data),

  createLesson: (pathId: string, data: Partial<AdminLesson>) =>
    client.post<ApiResponse<AdminLesson>>(`/admin/paths/${pathId}/lessons`, data).then((r) => r.data.data),

  updateLesson: (id: string, data: Partial<AdminLesson>) =>
    client.patch<ApiResponse<AdminLesson>>(`/admin/lessons/${id}`, data).then((r) => r.data.data),

  deleteLesson: (id: string) =>
    client.delete(`/admin/lessons/${id}`).then((r) => r.data),

  // Steps
  getSteps: (lessonId: string) =>
    client.get<ApiResponse<AdminStep[]>>(`/admin/lessons/${lessonId}/steps`).then((r) => r.data.data),

  createStep: (lessonId: string, data: { stepType: string; orderIndex: number; content: Record<string, unknown> }) =>
    client.post<ApiResponse<AdminStep>>(`/admin/lessons/${lessonId}/steps`, data).then((r) => r.data.data),

  updateStep: (id: string, data: { orderIndex?: number; content?: Record<string, unknown> }) =>
    client.patch<ApiResponse<AdminStep>>(`/admin/steps/${id}`, data).then((r) => r.data.data),

  deleteStep: (id: string) =>
    client.delete(`/admin/steps/${id}`).then((r) => r.data),

  // Questions
  createQuestion: (stepId: string, data: { questionText: string; explanation?: string }) =>
    client.post<ApiResponse<AdminQuestion>>(`/admin/steps/${stepId}/questions`, data).then((r) => r.data.data),

  updateQuestion: (id: string, data: { questionText?: string; explanation?: string }) =>
    client.patch<ApiResponse<AdminQuestion>>(`/admin/questions/${id}`, data).then((r) => r.data.data),

  deleteQuestion: (id: string) =>
    client.delete(`/admin/questions/${id}`).then((r) => r.data),

  // Options
  createOption: (questionId: string, data: { text: string; isCorrect: boolean; orderIndex?: number }) =>
    client.post<ApiResponse<AdminOption>>(`/admin/questions/${questionId}/options`, data).then((r) => r.data.data),

  updateOption: (id: string, data: { text?: string; isCorrect?: boolean; orderIndex?: number }) =>
    client.patch<ApiResponse<AdminOption>>(`/admin/options/${id}`, data).then((r) => r.data.data),

  deleteOption: (id: string) =>
    client.delete(`/admin/options/${id}`).then((r) => r.data),

  // Users
  getUsers: () =>
    client.get<ApiResponse<AdminUser[]>>('/admin/users').then((r) => r.data.data),

  updateUserPlan: (id: string, plan: 'FREE' | 'PRO') =>
    client.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/plan`, { plan }).then((r) => r.data.data),
}
