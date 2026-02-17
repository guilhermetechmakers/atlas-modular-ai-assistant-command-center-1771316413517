/**
 * Command Center types for dashboard summary and aggregations.
 * DB table: command_center (user-scoped summary items).
 */

export interface CommandCenterItem {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface TodayEvent {
  id: string
  title: string
  start: string
  end: string
  type: 'event' | 'focus_block' | 'task'
  source?: string
}

export interface GitHubActivity {
  id: string
  repo: string
  type: 'commit' | 'pr' | 'issue'
  title: string
  link?: string
  created_at: string
}

export interface ContentPipelineSummary {
  dueDrafts: number
  scheduledPosts: number
  latestIdea?: string
}

export interface FinanceSnapshot {
  recentCount: number
  runwayMonths?: number
  alert?: 'ok' | 'warning' | 'critical'
}

export interface AgentActivityItem {
  id: string
  agentName: string
  summary: string
  createdAt: string
  status: 'completed' | 'pending_approval'
  actionUrl?: string
}

export interface GlobalSearchResult {
  id: string
  type: 'repo' | 'note' | 'event' | 'transaction'
  title: string
  subtitle?: string
  url: string
}
