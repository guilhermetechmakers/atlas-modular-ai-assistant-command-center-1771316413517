/**
 * Repo Selector – connect/manage GitHub accounts and choose repos.
 */
import { useState } from 'react'
import { FolderGit2, GitBranch, Link2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { GitHubRepo } from '@/types/projects-github'

export interface RepoSelectorProps {
  repos: GitHubRepo[]
  isLoading?: boolean
  selectedRepo: string | null
  onSelectRepo: (repo: string | null) => void
  onConnectGitHub?: () => void
}

export function RepoSelector({
  repos,
  isLoading = false,
  selectedRepo,
  onSelectRepo,
  onConnectGitHub,
}: RepoSelectorProps) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? repos.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.full_name.toLowerCase().includes(search.toLowerCase())
      )
    : repos

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderGit2 className="h-5 w-5 text-primary" />
            Repositories
          </CardTitle>
          <CardDescription>Connect GitHub and choose repos to view activity and issues.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <RepoCardSkeleton />
            <RepoCardSkeleton />
            <RepoCardSkeleton />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderGit2 className="h-5 w-5 text-primary" />
            Repositories
          </CardTitle>
          <CardDescription>Connect GitHub and choose repos to view activity and issues.</CardDescription>
        </div>
        {onConnectGitHub && (
          <Button
            size="sm"
            variant="outline"
            onClick={onConnectGitHub}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Connect GitHub
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {repos.length > 0 ? (
          <>
            <Input
              placeholder="Search repos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
              aria-label="Search repositories"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((repo) => (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => onSelectRepo(selectedRepo === repo.full_name ? null : repo.full_name)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-4 text-left transition-all duration-200',
                    'hover:border-primary/30 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selectedRepo === repo.full_name
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border bg-card'
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <FolderGit2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{repo.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <GitBranch className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{repo.full_name}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {repo.open_issues_count} issues
                  </Badge>
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">No repos match &quot;{search}&quot;.</p>
            )}
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card-secondary/50 p-8 text-center"
            role="status"
            aria-label="No repositories"
          >
            <FolderGit2 className="h-12 w-12 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">No repositories yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect your GitHub account to see and select repos.
            </p>
            {onConnectGitHub && (
              <Button
                size="sm"
                className="mt-4 transition-transform duration-200 hover:scale-[1.02]"
                onClick={onConnectGitHub}
              >
                <Link2 className="mr-2 h-4 w-4" />
                Connect GitHub
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RepoCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-4">
      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-14 rounded-md" />
    </div>
  )
}
