/**
 * Task Board – Kanban mapped to GitHub issue states, drag-and-drop.
 */
import { useState, useCallback } from 'react'
import { LayoutGrid, GripVertical } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { GitHubIssue } from '@/types/projects-github'

const KANBAN_COLUMNS: { id: string; label: string; state: 'open' | 'closed' }[] = [
  { id: 'open', label: 'Open', state: 'open' },
  { id: 'closed', label: 'Closed', state: 'closed' },
]

export interface TaskBoardProps {
  issues: GitHubIssue[]
  isLoading?: boolean
  selectedRepo: string | null
  onMoveIssue?: (issueId: string, newState: 'open' | 'closed') => void
}

export function TaskBoard({
  issues,
  isLoading = false,
  selectedRepo,
  onMoveIssue,
}: TaskBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const issuesByState = KANBAN_COLUMNS.map((col) => ({
    ...col,
    issues: issues.filter((i) => i.state === col.state),
  }))

  const handleDragStart = useCallback((e: React.DragEvent, issueId: string) => {
    setDraggedId(issueId)
    e.dataTransfer.setData('text/plain', issueId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedId(null)
    setDragOverColumn(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, columnId: string) => {
      e.preventDefault()
      setDragOverColumn(null)
      const issueId = e.dataTransfer.getData('text/plain')
      if (!issueId || !onMoveIssue) return
      const col = KANBAN_COLUMNS.find((c) => c.id === columnId)
      if (col) onMoveIssue(issueId, col.state)
      setDraggedId(null)
    },
    [onMoveIssue]
  )

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Task board
          </CardTitle>
          <CardDescription>Kanban mapped to GitHub issue states.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {KANBAN_COLUMNS.map((col) => (
              <Skeleton key={col.id} className="h-64 w-72 shrink-0 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Task board
        </CardTitle>
        <CardDescription>Kanban mapped to GitHub issue states. Drag issues between columns.</CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedRepo ? (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8"
            role="status"
          >
            <LayoutGrid className="h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Select a repo to view the task board.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2" role="list">
            {issuesByState.map((col) => (
              <div
                key={col.id}
                className={cn(
                  'flex w-72 shrink-0 flex-col rounded-lg border-2 border-dashed p-3 transition-colors',
                  dragOverColumn === col.id ? 'border-primary bg-primary/5' : 'border-border bg-card-secondary/50'
                )}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm">{col.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {col.issues.length}
                  </Badge>
                </div>
                <ul className="flex flex-1 flex-col gap-2 min-h-[120px]" role="list">
                  {col.issues.map((issue) => (
                    <li
                      key={issue.id}
                      draggable={!!onMoveIssue}
                      onDragStart={(e) => handleDragStart(e, issue.id)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        'rounded-lg border border-border bg-card p-3 transition-all duration-200',
                        'hover:shadow-sm hover:border-primary/20',
                        draggedId === issue.id && 'opacity-50',
                        onMoveIssue && 'cursor-grab active:cursor-grabbing'
                      )}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (onMoveIssue && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault()
                          const nextCol = col.state === 'open' ? 'closed' : 'open'
                          onMoveIssue(issue.id, nextCol)
                        }
                      }}
                      aria-label={`Issue #${issue.number} ${issue.title}. Drag to move.`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">#{issue.number} {issue.title}</p>
                          {issue.labels && issue.labels.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {issue.labels.slice(0, 2).map((l) => (
                                <Badge key={l.name} variant="outline" className="text-xs">
                                  {l.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
