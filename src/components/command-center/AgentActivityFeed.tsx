import { Link } from 'react-router-dom'
import { Bot, CheckCircle, Clock, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAgentActivity } from '@/hooks/useCommandCenter'
import { cn } from '@/lib/utils'

export function AgentActivityFeed() {
  const { data: items = [], isLoading, isError } = useAgentActivity()
  const pendingCount = items.filter((i) => i.status === 'pending_approval').length

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-5 w-5 text-primary" />
          Agent Activity
        </CardTitle>
        <CardDescription>
          Recent agent outputs, pending approvals.
          {pendingCount > 0 && (
            <span className="ml-1 font-medium text-foreground">{pendingCount} pending</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <>
            <AgentSkeleton />
            <AgentSkeleton />
            <AgentSkeleton />
          </>
        )}
        {isError && (
          <p className="text-sm text-muted-foreground">Could not load agent activity.</p>
        )}
        {!isLoading && !isError && items.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <Bot className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No recent agent activity.</p>
            <p className="mt-1 text-xs text-muted-foreground">Ask &quot;What should I do today?&quot; to get started.</p>
          </div>
        )}
        {!isLoading && items.length > 0 && (
          <ul className="space-y-2" role="list">
            {items.slice(0, 5).map((item) => (
              <li key={item.id}>
                <div
                  className={cn(
                    'flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30'
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{item.agentName}</p>
                    <p className="text-sm font-medium text-foreground line-clamp-2">{item.summary}</p>
                    {item.status === 'pending_approval' && (
                      <Badge variant="warning" className="mt-2">
                        Pending approval
                      </Badge>
                    )}
                  </div>
                  {item.actionUrl && (
                    <a
                      href={item.actionUrl}
                      className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground"
                      aria-label="View action"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  {item.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 shrink-0 text-atlas-cyan" aria-hidden />
                  )}
                  {item.status === 'pending_approval' && (
                    <Clock className="h-4 w-4 shrink-0 text-atlas-yellow" aria-hidden />
                  )}
                </div>
              </li>
            ))}
            <Link to="/dashboard/agents">
              <Button variant="ghost" size="sm" className="w-full">
                View all activity
              </Button>
            </Link>
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function AgentSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
