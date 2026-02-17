import { Link } from 'react-router-dom'
import { Calendar, Clock, ListTodo, Square } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTodayPanel } from '@/hooks/useCommandCenter'
import { cn } from '@/lib/utils'
import type { TodayEvent } from '@/types/command-center'

const typeIcons: Record<TodayEvent['type'], typeof Calendar> = {
  event: Calendar,
  focus_block: Square,
  task: ListTodo,
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  } catch {
    return ''
  }
}

export function TodayPanel() {
  const { data: events = [], isLoading, isError } = useTodayPanel()

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-5 w-5 text-primary" />
          Today
        </CardTitle>
        <CardDescription>Calendar events, focus blocks, quick tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <>
            <TodaySkeleton />
            <TodaySkeleton />
            <TodaySkeleton />
          </>
        )}
        {isError && (
          <p className="text-sm text-muted-foreground">Unable to load today’s schedule.</p>
        )}
        {!isLoading && !isError && events.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No events or tasks for today.</p>
            <Link to="/dashboard/personal">
              <Button variant="outline" size="sm" className="mt-3">
                Open calendar
              </Button>
            </Link>
          </div>
        )}
        {!isLoading && events.length > 0 && (
          <ul className="space-y-2" role="list">
            {events.slice(0, 5).map((ev) => {
              const Icon = typeIcons[ev.type]
              return (
                <li key={ev.id}>
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30'
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(ev.start)}
                        {ev.end ? ` – ${formatTime(ev.end)}` : ''}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
            {events.length > 5 && (
              <Link to="/dashboard/personal">
                <Button variant="ghost" size="sm" className="w-full">
                  View all ({events.length})
                </Button>
              </Link>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function TodaySkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
