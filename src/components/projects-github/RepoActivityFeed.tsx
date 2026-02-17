/**
 * Repo Activity Feed – commits, PRs, issues with filters.
 */
import { useState } from 'react'
import { GitCommit, GitPullRequest, AlertCircle, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { GitHubCommit, GitHubPullRequest, GitHubIssue } from '@/types/projects-github'

type ActivityItem = GitHubCommit | GitHubPullRequest | GitHubIssue
type ActivityType = 'commit' | 'pr' | 'issue'

function getType(item: ActivityItem): ActivityType {
  if ('sha' in item) return 'commit'
  if ('number' in item && 'head' in item) return 'pr'
  return 'issue'
}

function getTitle(item: ActivityItem): string {
  if ('message' in item) return (item as GitHubCommit).message
  return (item as GitHubIssue | GitHubPullRequest).title
}

function getLink(item: ActivityItem): string | undefined {
  if ('html_url' in item) return item.html_url
  return undefined
}

function getRepo(item: ActivityItem): string {
  return 'repo' in item ? item.repo : ''
}

function getCreatedAt(item: ActivityItem): string {
  return item.created_at
}

const typeIcons: Record<ActivityType, typeof GitCommit> = {
  commit: GitCommit,
  pr: GitPullRequest,
  issue: AlertCircle,
}

const typeLabels: Record<ActivityType, string> = {
  commit: 'Commit',
  pr: 'PR',
  issue: 'Issue',
}

export interface RepoActivityFeedProps {
  activity: ActivityItem[]
  isLoading?: boolean
  repos: string[]
  selectedRepo: string | null
  onFilterByRepo: (repo: string | null) => void
}

export function RepoActivityFeed({
  activity,
  isLoading = false,
  repos,
  selectedRepo,
  onFilterByRepo,
}: RepoActivityFeedProps) {
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all')

  const filtered =
    typeFilter === 'all'
      ? activity
      : activity.filter((a) => getType(a) === typeFilter)

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="text-base">Activity feed</CardTitle>
          <CardDescription>Recent commits, PRs, and issues.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="text-base">Activity feed</CardTitle>
        <CardDescription>Recent commits, PRs, and issues. Filter by repo or type.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedRepo === null ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 text-xs"
            onClick={() => onFilterByRepo(null)}
          >
            All repos
          </Button>
          {repos.slice(0, 6).map((repo) => (
            <Button
              key={repo}
              variant={selectedRepo === repo ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 max-w-[140px] truncate text-xs"
              onClick={() => onFilterByRepo(repo)}
            >
              {repo.split('/').pop() ?? repo}
            </Button>
          ))}
          <div className="flex gap-1 border-l border-border pl-2">
            {(['all', 'commit', 'pr', 'issue'] as const).map((t) => (
              <Button
                key={t}
                variant={typeFilter === t ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setTypeFilter(t)}
              >
                {t === 'all' ? 'All' : typeLabels[t]}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card-secondary/30 p-8 text-center"
            role="status"
            aria-label="No activity"
          >
            <GitCommit className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">No activity yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect a repo and push commits, open PRs, or create issues to see them here.
            </p>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {filtered.slice(0, 20).map((a, i) => {
              const type = getType(a)
              const Icon = typeIcons[type]
              const link = getLink(a)
              const title = getTitle(a)
              const repo = getRepo(a)
              const createdAt = getCreatedAt(a)
              const content = (
                <>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{title}</p>
                    <p className="text-xs text-muted-foreground">
                      {repo} · {typeLabels[type]} · {new Date(createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {link && <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </>
              )
              return (
                <li
                  key={'sha' in a ? a.sha : a.id}
                  className={cn(
                    'rounded-lg border border-border p-3 transition-all duration-200',
                    'hover:border-primary/30 hover:shadow-sm',
                    'animate-fade-in-up motion-reduce:animate-none'
                  )}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3">{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
