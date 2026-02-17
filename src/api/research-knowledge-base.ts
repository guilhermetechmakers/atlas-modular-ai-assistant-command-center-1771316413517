import { api } from '@/lib/api'
import type { ResearchKnowledgeBase } from '@/types/research-knowledge-base'

const BASE = '/research-knowledge-base'

export const researchKnowledgeBaseApi = {
  list: () => api.get<ResearchKnowledgeBase[]>(BASE),
  get: (id: string) => api.get<ResearchKnowledgeBase>(`${BASE}/${id}`),
  create: (data: Pick<ResearchKnowledgeBase, 'title' | 'description' | 'status'>) =>
    api.post<ResearchKnowledgeBase>(BASE, data),
  update: (
    id: string,
    data: Partial<Pick<ResearchKnowledgeBase, 'title' | 'description' | 'status'>>
  ) => api.patch<ResearchKnowledgeBase>(`${BASE}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),
}
