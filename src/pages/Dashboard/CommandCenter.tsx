import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  GlobalSearchBar,
  TodayPanel,
  GitHubSummaryCard,
  ContentPipelineCard,
  FinanceSnapshotCard,
  AgentActivityFeed,
  QuickActionsToolbar,
  NotificationsAuditLogQuickLink,
} from '@/components/command-center'

export function CommandCenterPage() {
  useEffect(() => {
    document.title = 'Command Center | Atlas'
    return () => {
      document.title = 'Atlas'
    }
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Command Center
          </h1>
          <p className="mt-1 text-muted-foreground">
            Your daily summary: GitHub, calendar, content, finance, and agent suggestions.
          </p>
        </div>
        <NotificationsAuditLogQuickLink className="shrink-0" />
      </header>

      <section aria-label="Global search">
        <GlobalSearchBar className="max-w-2xl" />
      </section>

      <section aria-label="Ask agent">
        <div className="rounded-card-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
          <h2 className="text-lg font-semibold text-foreground">What should I do today?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask the agent for a daily agenda or review suggested actions.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button size="sm" className="transition-transform hover:scale-[1.02]" asChild>
              <Link to="/dashboard/agents" className="inline-flex items-center gap-2">
                <Bot className="h-4 w-4" />
                What should I do today?
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="transition-transform hover:scale-[1.02]" asChild>
              <Link to="/dashboard/personal">View calendar</Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-label="Quick actions">
        <QuickActionsToolbar />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TodayPanel />
        <GitHubSummaryCard />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ContentPipelineCard />
        <FinanceSnapshotCard />
      </section>

      <section aria-label="Agent activity">
        <AgentActivityFeed />
      </section>
    </div>
  )
}

export default CommandCenterPage
