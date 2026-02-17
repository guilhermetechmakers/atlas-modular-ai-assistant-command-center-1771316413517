import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderGit2, GitCommit, GitPullRequest, AlertCircle, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGitHubSummary } from '@/hooks/useCommandCenter'
import { cn } from '@/lib/utils'
import type { GitHubActivity } from '@/types/command-center'

const typeIcons: Record<GitHubActivity['type'], typeof GitCommit> = {
  commit: GitCommit,
  pr: GitPullRequest,
  issue: AlertCircle,
}

const typeLabels: Record<GitHubActivity['type'], string> = {
  commit: 'Commit',
  pr: 'PR',
  issue: 'Issue',
}

export function GitHubSummaryCard() {
  const [repoFilter, setRepoFilter] = useState<string | undefined>(undefined)
  const { data: activities = [], isLoading, isError } = useGitHubSummary(repoFilter)

  const repos = Array.from(new Set(activities.map((a) => a.repo))).slice(0, 5)

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderGit2 className="h-5 w-5 text-primary" />
            GitHub
          </CardTitle>
          <Link to="/dashboard/projects">
            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>Recent commits, PRs, issues. Filter by repo below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {repos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={repoFilter === undefined ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setRepoFilter(undefined)}
            >
              All
            </Button>
            {repos.map((repo) => (
              <Button
                key={repo}
                variant={repoFilter === repo ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setRepoFilter(repo)}
              >
                {repo}
              </Button>
            ))}
          </div>
        )}
        {isLoading && (
          <>
            <GitHubSkeleton />
            <GitHubSkeleton />
            <GitHubSkeleton />
          </>
        )}
        {isError && (
          <p className="text-sm text-muted-foreground">Could not load GitHub activity.</p>
        )}
        {!isLoading && !isError && activities.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <FolderGit2 className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No recent activity.</p>
            <Link to="/dashboard/projects">
              <Button variant="outline" size="sm" className="mt-3">
                Open Projects
              </Button>
            </Link>
          </div>
        )}
        {!isLoading && activities.length > 0 && (
          <ul className="space-y-2" role="list">
            {activities.slice(0, 6).map((a) => {
              const Icon = typeIcons[a.type]
              return (
                <li key={a.id}>
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5'
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.repo} · {typeLabels[a.type]}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function GitHubSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}
