import { api } from '@/lib/api'
import type {
  CommandCenterItem,
  TodayEvent,
  GitHubActivity,
  ContentPipelineSummary,
  FinanceSnapshot,
  AgentActivityItem,
  GlobalSearchResult,
} from '@/types/command-center'

const BASE = '/command-center'

export const commandCenterApi = {
  list: () => api.get<CommandCenterItem[]>(BASE),
  get: (id: string) => api.get<CommandCenterItem>(`${BASE}/${id}`),
  create: (data: Pick<CommandCenterItem, 'title' | 'description' | 'status'>) =>
    api.post<CommandCenterItem>(BASE, data),
  update: (
    id: string,
    data: Partial<Pick<CommandCenterItem, 'title' | 'description' | 'status'>>
  ) => api.patch<CommandCenterItem>(`${BASE}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),

  today: () => api.get<TodayEvent[]>(`${BASE}/today`),
  github: (repo?: string) =>
    api.get<GitHubActivity[]>(`${BASE}/github${repo ? `?repo=${encodeURIComponent(repo)}` : ''}`),
  contentSummary: () => api.get<ContentPipelineSummary>(`${BASE}/content-summary`),
  financeSnapshot: () => api.get<FinanceSnapshot>(`${BASE}/finance-snapshot`),
  agentActivity: () => api.get<AgentActivityItem[]>(`${BASE}/agent-activity`),
  search: (q: string) =>
    api.get<GlobalSearchResult[]>(`${BASE}/search?q=${encodeURIComponent(q)}`),
}
