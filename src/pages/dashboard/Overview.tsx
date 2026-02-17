import { Link } from 'react-router-dom'
import {
  FolderGit2,
  FileText,
  Wallet,
  Calendar,
  Bot,
  ArrowUpRight,
  ClipboardList,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const quickCards = [
  { to: '/dashboard/projects', label: 'GitHub summary', icon: FolderGit2, description: 'Repos and issues' },
  { to: '/dashboard/content', label: 'Content pipeline', icon: FileText, description: 'Drafts and calendar' },
  { to: '/dashboard/finance', label: 'Finance snapshot', icon: Wallet, description: 'Runway and alerts' },
  { to: '/dashboard/personal', label: 'Today', icon: Calendar, description: 'Events and tasks' },
]

export function DashboardOverviewPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Command Center</h1>
        <p className="mt-1 text-muted-foreground">Your daily summary and agent prompts.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Today</h2>
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">What should I do today?</CardTitle>
            <CardDescription>Ask the Personal agent for an agenda or review suggested actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">What should I do today?</Button>
              <Button size="sm" variant="outline">View calendar</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickCards.map(({ to, label, icon: Icon, description }) => (
          <Link key={to} to={to}>
            <Card className="h-full transition-all duration-300 hover:shadow-card-hover hover:border-primary/30 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Agent activity
            </CardTitle>
            <CardDescription>Recent agent suggestions and pending approvals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ActivitySkeleton />
              <ActivitySkeleton />
              <ActivitySkeleton />
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              View all activity
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Quick actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary">Summarize repos</Button>
            <Button size="sm" variant="secondary">New content idea</Button>
            <Button size="sm" variant="secondary">Monthly finance report</Button>
            <Link to="/dashboard/audit">
              <Button size="sm" variant="outline">Audit log</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-full" />
      </div>
      <Badge variant="secondary">Pending</Badge>
    </div>
  )
}
