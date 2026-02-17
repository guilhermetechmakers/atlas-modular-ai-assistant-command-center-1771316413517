import { Users, BarChart3, Shield, FileText, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function AdminPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Workspace governance, users, and audit.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Users</CardDescription>
            <CardTitle className="text-2xl">—</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">Manage</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending skills</CardDescription>
            <CardTitle className="text-2xl">—</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">Review queue</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User management
            </CardTitle>
            <CardDescription>Invites, roles, and permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Usage analytics
            </CardTitle>
            <CardDescription>Agent runs and rate limits.</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Skill approval queue
          </CardTitle>
          <CardDescription>Approve or reject third-party skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
            No pending approvals.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Audit logs
          </CardTitle>
          <CardDescription>Append-only, immutable entries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/audit">View audit logs</a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            System settings
          </CardTitle>
          <CardDescription>Retention and backup policy.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm">Configure</Button>
        </CardContent>
      </Card>
    </div>
  )
}
