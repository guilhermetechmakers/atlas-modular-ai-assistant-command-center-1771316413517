import { Link } from 'react-router-dom'
import { Wallet, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useFinanceSnapshot } from '@/hooks/useCommandCenter'
import { cn } from '@/lib/utils'

export function FinanceSnapshotCard() {
  const { data, isLoading, isError } = useFinanceSnapshot()
  const snapshot = data ?? { recentCount: 0 }
  const hasAlert = snapshot.alert && snapshot.alert !== 'ok'

  return (
    <Card
      className={cn(
        'h-full transition-all duration-300 hover:shadow-card-hover',
        hasAlert && 'border-atlas-yellow/50'
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-5 w-5 text-primary" />
            Finance
          </CardTitle>
          <Link to="/dashboard/finance">
            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
              View
            </Button>
          </Link>
        </div>
        <CardDescription>Recent transactions, runway alert.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        )}
        {isError && (
          <p className="text-sm text-muted-foreground">Could not load finance snapshot.</p>
        )}
        {!isLoading && !isError && (
          <>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <span className="text-sm text-muted-foreground">Recent transactions</span>
              <span className="text-lg font-semibold text-foreground">{snapshot.recentCount}</span>
            </div>
            {snapshot.runwayMonths != null && (
              <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Runway: <strong>{snapshot.runwayMonths} months</strong>
                </span>
              </div>
            )}
            {hasAlert && (
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg border p-3',
                  snapshot.alert === 'critical'
                    ? 'border-destructive/50 bg-destructive/10'
                    : 'border-atlas-yellow/50 bg-atlas-yellow/10'
                )}
              >
                <AlertTriangle
                  className={cn(
                    'h-4 w-4 shrink-0',
                    snapshot.alert === 'critical' ? 'text-destructive' : 'text-atlas-yellow'
                  )}
                />
                <span className="text-sm">
                  {snapshot.alert === 'critical'
                    ? 'Runway critical — review finances.'
                    : 'Runway warning — consider planning.'}
                </span>
              </div>
            )}
            {!hasAlert && snapshot.recentCount === 0 && (
              <p className="text-sm text-muted-foreground">No recent transactions.</p>
            )}
            <Link to="/dashboard/finance">
              <Button variant="outline" size="sm" className="w-full">
                Open Finance
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}
