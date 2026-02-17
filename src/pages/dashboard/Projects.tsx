import { useState } from 'react'
import { FolderGit2, Plus, GitBranch } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export function ProjectsPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Projects</h1>
          <p className="mt-1 text-muted-foreground">GitHub repos, issues, and roadmaps.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create issue
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repo selector</CardTitle>
          <CardDescription>Select a repository to view activity, issues, and roadmap.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search repos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <RepoCardSkeleton />
            <RepoCardSkeleton />
            <RepoCardSkeleton />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity feed</CardTitle>
            <CardDescription>Recent commits and issue updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI PM actions</CardTitle>
            <CardDescription>Create roadmap, milestones, or weekly update.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Create roadmap
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Weekly update template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RepoCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/30">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
        <FolderGit2 className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Badge variant="outline">0 issues</Badge>
    </div>
  )
}
