import client from './client'
import type { LearningPath, LearningPathDetail, ApiResponse } from '../types'

export const pathsApi = {
  getAll: () =>
    client.get<ApiResponse<LearningPath[]>>('/paths').then((r) => r.data.data),

  getOne: (slug: string) =>
    client.get<ApiResponse<LearningPathDetail>>(`/paths/${slug}`).then((r) => r.data.data),
}
