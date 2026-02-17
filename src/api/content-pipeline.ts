import { api } from '@/lib/api'
import type { ContentPipeline } from '@/types/content-pipeline'

const BASE = '/content-pipeline'

export const contentPipelineApi = {
  list: () => api.get<ContentPipeline[]>(BASE),
  get: (id: string) => api.get<ContentPipeline>(`${BASE}/${id}`),
  create: (data: Pick<ContentPipeline, 'title' | 'description' | 'status'>) =>
    api.post<ContentPipeline>(BASE, data),
  update: (id: string, data: Partial<Pick<ContentPipeline, 'title' | 'description' | 'status'>>) =>
    api.patch<ContentPipeline>(`${BASE}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),
}
