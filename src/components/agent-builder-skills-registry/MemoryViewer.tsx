import { useState } from 'react'
import { Brain, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { MemoryEntry as MemoryEntryType } from '@/types/agent-builder-skills-registry'

export interface MemoryViewerProps {
  agentId: string | null
  agentName?: string
  entries: MemoryEntryType[]
  isLoading?: boolean
  onPurgeEntry?: (entryId: string) => void
  onPurgeAll?: () => void
  emptyMessage?: string
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function MemoryViewer({
  agentId,
  agentName,
  entries,
  isLoading = false,
  onPurgeEntry,
  onPurgeAll,
  emptyMessage = 'No memory entries for this agent.',
}: MemoryViewerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Memory viewer
          </CardTitle>
          <CardDescription>Per-agent memory entries and purge controls.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const hasEntries = entries.length > 0

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Memory viewer
          </CardTitle>
          <CardDescription>Per-agent memory entries and purge controls.</CardDescription>
          {agentName && (
            <p className="mt-1 text-sm text-muted-foreground">Agent: {agentName}</p>
          )}
        </div>
        {hasEntries && onPurgeAll && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/50 hover:bg-destructive/10 transition-transform duration-200 hover:scale-[1.02]"
            onClick={onPurgeAll}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Purge all
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!agentId ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card-secondary/50 py-12 px-4 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mb-3" aria-hidden />
            <p className="text-sm text-muted-foreground">Select an agent to view memory.</p>
          </div>
        ) : !hasEntries ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card-secondary/50 py-12 px-4 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mb-3" aria-hidden />
            <p className="text-sm text-muted-foreground max-w-sm">{emptyMessage}</p>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {entries.map((entry) => {
              const isExpanded = expandedId === entry.id
              return (
                <li
                  key={entry.id}
                  className="rounded-lg border border-border bg-card-secondary/50 overflow-hidden transition-all duration-200 hover:border-primary/30"
                >
                  <div className="flex items-center gap-2 p-3">
                    <button
                      type="button"
                      className="p-0.5 rounded hover:bg-muted transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    <span className="font-mono text-sm text-foreground truncate flex-1">
                      {entry.key}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(entry.created_at)}
                    </span>
                    {onPurgeEntry && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => onPurgeEntry(entry.id)}
                        aria-label={`Purge entry ${entry.key}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="border-t border-border px-3 py-2 bg-background/50">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {entry.value}
                      </p>
                    </div>
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
