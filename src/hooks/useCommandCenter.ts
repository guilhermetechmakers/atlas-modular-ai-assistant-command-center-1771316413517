import { useQuery } from '@tanstack/react-query'
import { commandCenterApi } from '@/api/command-center'
import type {
  TodayEvent,
  GitHubActivity,
  ContentPipelineSummary,
  FinanceSnapshot,
  AgentActivityItem,
  GlobalSearchResult,
} from '@/types/command-center'

export const commandCenterKeys = {
  all: ['command-center'] as const,
  today: () => [...commandCenterKeys.all, 'today'] as const,
  github: (repo?: string) => [...commandCenterKeys.all, 'github', repo] as const,
  contentSummary: () => [...commandCenterKeys.all, 'content-summary'] as const,
  financeSnapshot: () => [...commandCenterKeys.all, 'finance-snapshot'] as const,
  agentActivity: () => [...commandCenterKeys.all, 'agent-activity'] as const,
  search: (q: string) => [...commandCenterKeys.all, 'search', q] as const,
}

export function useTodayPanel() {
  return useQuery({
    queryKey: commandCenterKeys.today(),
    queryFn: () => commandCenterApi.today(),
    placeholderData: [] as TodayEvent[],
  })
}

export function useGitHubSummary(repo?: string) {
  return useQuery({
    queryKey: commandCenterKeys.github(repo),
    queryFn: () => commandCenterApi.github(repo),
    placeholderData: [] as GitHubActivity[],
  })
}

export function useContentPipelineSummary() {
  return useQuery({
    queryKey: commandCenterKeys.contentSummary(),
    queryFn: () => commandCenterApi.contentSummary(),
    placeholderData: { dueDrafts: 0, scheduledPosts: 0 } as ContentPipelineSummary,
  })
}

export function useFinanceSnapshot() {
  return useQuery({
    queryKey: commandCenterKeys.financeSnapshot(),
    queryFn: () => commandCenterApi.financeSnapshot(),
    placeholderData: { recentCount: 0 } as FinanceSnapshot,
  })
}

export function useAgentActivity() {
  return useQuery({
    queryKey: commandCenterKeys.agentActivity(),
    queryFn: () => commandCenterApi.agentActivity(),
    placeholderData: [] as AgentActivityItem[],
  })
}

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: commandCenterKeys.search(query),
    queryFn: () => commandCenterApi.search(query),
    enabled: query.length >= 2,
    placeholderData: [] as GlobalSearchResult[],
  })
}
