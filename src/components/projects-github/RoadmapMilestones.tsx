/**
 * Roadmap & Milestones: timeline view with milestones and ability to create epics/milestones.
 */
import { useState } from 'react'
import { Flag, Plus, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { GitHubMilestone } from '@/types/projects-github'

export interface RoadmapMilestonesProps {
  milestones: GitHubMilestone[]
  isLoading?: boolean
  selectedRepo: string | null
  onCreateMilestone?: () => void
}

export function RoadmapMilestones(props: RoadmapMilestonesProps) {
  const { milestones, isLoading = false, selectedRepo, onCreateMilestone } = props
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = selectedId ? (milestones.find(m => m.id === selectedId) ?? null) : null
  const sortedMilestones = [...milestones].sort(
    (a, b) => (a.due_on ?? '').localeCompare(b.due_on ?? '') || a.title.localeCompare(b.title)
  )

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flag className="h-5 w-5 text-primary" />
            Roadmap & Milestones
          </CardTitle>
          <CardDescription>Timeline view with milestones and epics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flag className="h-5 w-5 text-primary" />
            Roadmap & Milestones
          </CardTitle>
          <CardDescription>Timeline view with milestones and ability to create epics/milestones.</CardDescription>
        </div>
        {onCreateMilestone && selectedRepo && (
          <Button
            size="sm"
            variant="outline"
            onClick={onCreateMilestone}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add milestone
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center"
            role="status"
          >
            <Flag className="h-12 w-12 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">No milestones yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add milestones to plan releases and epics. Select a repo to add one.
            </p>
            {onCreateMilestone && selectedRepo && (
              <Button size="sm" className="mt-4 hover:scale-[1.02] transition-transform" onClick={onCreateMilestone}>
                <Plus className="mr-2 h-4 w-4" />
                Add milestone
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <ul className="space-y-2" role="list">
              {sortedMilestones.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}
                    className={cn(
                      'w-full rounded-lg border p-4 text-left transition-all duration-200',
                      'hover:border-primary/30 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      selectedId === m.id ? 'border-primary bg-primary/10' : 'border-border bg-card'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-medium text-foreground truncate">{m.title}</span>
                      <Badge variant={m.state === 'open' ? 'default' : 'secondary'} className="shrink-0">
                        {m.state}
                      </Badge>
                    </div>
                    {m.due_on && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(m.due_on).toLocaleDateString()}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {m.open_issues} open · {m.closed_issues} closed
                    </p>
                  </button>
                </li>
              ))}
            </ul>
            <div>
              {selected ? (
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Flag className="h-4 w-4 text-primary" />
                      {selected.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={selected.state === 'open' ? 'default' : 'secondary'}>
                        {selected.state}
                      </Badge>
                      {selected.due_on && (
                        <Badge variant="outline">
                          <Calendar className="mr-1 h-3 w-3" />
                          Due {new Date(selected.due_on).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selected.description ? (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.description}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No description.</p>
                    )}
                    <p className="mt-3 text-xs text-muted-foreground">
                      {selected.open_issues} open issues · {selected.closed_issues} closed
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div
                  className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center"
                  role="status"
                >
                  <Flag className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Select a milestone for details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
