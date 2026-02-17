/**
 * Projects (GitHub) – types for DB schema and GitHub API models.
 * Table: projects_(github); OAuth-driven repos, issues, PRs, milestones.
 */

/** DB record for user's project preferences (e.g. linked repos). */
export interface ProjectsGitHubRecord {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface GitHubRepo {
  id: string
  name: string
  full_name: string
  private: boolean
  default_branch: string
  open_issues_count: number
  stargazers_count?: number
  html_url?: string
}

export interface GitHubIssue {
  id: string
  number: number
  title: string
  state: 'open' | 'closed'
  body?: string
  repo: string
  html_url?: string
  created_at: string
  updated_at: string
  labels?: { name: string; color?: string }[]
  assignee?: string
}

export interface GitHubPullRequest {
  id: string
  number: number
  title: string
  state: 'open' | 'closed' | 'merged'
  repo: string
  html_url?: string
  created_at: string
  updated_at: string
  head?: { ref: string }
  base?: { ref: string }
}

export interface GitHubCommit {
  id: string
  sha: string
  message: string
  repo: string
  author?: string
  html_url?: string
  created_at: string
}

export type RepoActivityItem =
  | { type: 'commit'; data: GitHubCommit }
  | { type: 'pr'; data: GitHubPullRequest }
  | { type: 'issue'; data: GitHubIssue }

export interface GitHubMilestone {
  id: string
  number?: number
  title: string
  state: 'open' | 'closed'
  description?: string
  due_on?: string
  open_issues: number
  closed_issues: number
  repo: string
}

export interface CreateIssuePayload {
  repo: string
  title: string
  body?: string
  labels?: string[]
}
