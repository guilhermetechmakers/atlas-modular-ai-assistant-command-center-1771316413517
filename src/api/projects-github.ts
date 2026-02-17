import { api } from '@/lib/api'
import type {
  ProjectsGitHubRecord,
  GitHubRepo,
  GitHubIssue,
  GitHubPullRequest,
  GitHubCommit,
  GitHubMilestone,
  CreateIssuePayload,
} from '@/types/projects-github'

const BASE = '/projects-github'

export const projectsGithubApi = {
  /** Project records (DB table projects_(github)) */
  list: () => api.get<ProjectsGitHubRecord[]>(BASE),
  get: (id: string) => api.get<ProjectsGitHubRecord>(`${BASE}/${id}`),
  create: (data: Pick<ProjectsGitHubRecord, 'title' | 'description' | 'status'>) =>
    api.post<ProjectsGitHubRecord>(BASE, data),
  update: (
    id: string,
    data: Partial<Pick<ProjectsGitHubRecord, 'title' | 'description' | 'status'>>
  ) => api.patch<ProjectsGitHubRecord>(`${BASE}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),

  /** GitHub-connected repos (requires OAuth) */
  repos: () => api.get<GitHubRepo[]>(`${BASE}/repos`),

  /** Activity feed: commits, PRs, issues (optional repo filter) */
  activity: (repo?: string) =>
    api.get<Array<GitHubCommit | GitHubPullRequest | GitHubIssue>>(
      `${BASE}/activity${repo ? `?repo=${encodeURIComponent(repo)}` : ''}`
    ),

  /** Issues for a repo (search, filter by state) */
  issues: (repo: string, params?: { state?: 'open' | 'closed'; search?: string }) => {
    const sp = new URLSearchParams()
    if (params?.state) sp.set('state', params.state)
    if (params?.search) sp.set('q', params.search)
    const qs = sp.toString()
    return api.get<GitHubIssue[]>(`${BASE}/repos/${encodeURIComponent(repo)}/issues${qs ? `?${qs}` : ''}`)
  },

  /** Create issue (MVP write op – mapped to github.create_issue) */
  createIssue: (payload: CreateIssuePayload) =>
    api.post<GitHubIssue>(`${BASE}/issues`, payload),

  /** Milestones for roadmap */
  milestones: (repo?: string) =>
    api.get<GitHubMilestone[]>(
      `${BASE}/milestones${repo ? `?repo=${encodeURIComponent(repo)}` : ''}`
    ),
}
