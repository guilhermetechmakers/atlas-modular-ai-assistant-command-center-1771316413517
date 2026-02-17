import { CreditCard, Zap, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface BillingAndPlanProps {
  planName?: string
  planStatus?: 'active' | 'trialing' | 'past_due' | 'canceled'
  isLoading?: boolean
  isSaaS?: boolean
  onUpgrade?: () => void
  onViewInvoices?: () => void
}

export function BillingAndPlan({
  planName = 'Self-hosted',
  planStatus = 'active',
  isLoading = false,
  isSaaS = false,
  onUpgrade,
  onViewInvoices,
}: BillingAndPlanProps) {
  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Billing & plan
          </CardTitle>
          <CardDescription>View plan, upgrade, invoices (if SaaS).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const statusVariant = planStatus === 'active' || planStatus === 'trialing' ? 'secondary' : 'destructive'

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Billing & plan
        </CardTitle>
        <CardDescription>
          View plan, upgrade, and invoices {isSaaS ? '(if SaaS)' : ''}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card-secondary/50 p-4',
            'transition-all duration-200 hover:border-primary/30'
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <Zap className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="font-medium text-foreground">{planName}</p>
              <Badge variant={statusVariant} className="mt-1">
                {planStatus.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          {isSaaS && (
            <div className="flex gap-2">
              {onUpgrade && (
                <Button
                  size="sm"
                  onClick={onUpgrade}
                  className="transition-transform duration-200 hover:scale-[1.02]"
                >
                  Upgrade
                </Button>
              )}
              {onViewInvoices && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewInvoices}
                  className="gap-1.5 transition-transform duration-200 hover:scale-[1.02]"
                >
                  <FileText className="h-4 w-4" />
                  Invoices
                </Button>
              )}
            </div>
          )}
        </div>
        {!isSaaS && (
          <p className="text-sm text-muted-foreground">
            Self-hosted deployment — no subscription billing. Manage your instance from your server or Docker.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
