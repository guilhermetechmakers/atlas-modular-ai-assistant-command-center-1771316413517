import { useState } from 'react'
import { Sparkles, FileText, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { FinanceTransaction, FinanceInvoice } from '@/types/finance-cockpit'

export interface FinanceAIToolsProps {
  transactions: FinanceTransaction[]
  invoices: FinanceInvoice[]
  isLoading?: boolean
  onRequestSummary?: () => void
  onRequestAnomalies?: () => void
  onRequestProfitability?: () => void
}

export function FinanceAITools({
  transactions,
  invoices,
  isLoading = false,
  onRequestSummary,
  onRequestAnomalies,
  onRequestProfitability,
}: FinanceAIToolsProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [anomalies, setAnomalies] = useState<string[]>([])
  const [profitability, setProfitability] = useState<{ client: string; profit_cents: number }[]>([])
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const handleMonthlySummary = () => {
    onRequestSummary?.()
    setLoadingAction('summary')
    setTimeout(() => {
      const income = transactions
        .filter((t) => t.amount_cents >= 0)
        .reduce((s, t) => s + t.amount_cents, 0) / 100
      const expenses = transactions
        .filter((t) => t.amount_cents < 0)
        .reduce((s, t) => s + Math.abs(t.amount_cents), 0) / 100
      setSummary(
        `This month: ${transactions.length} transactions. Income: ${income.toFixed(2)}, Expenses: ${expenses.toFixed(2)}, Net: ${(income - expenses).toFixed(2)}.`
      )
      setLoadingAction(null)
    }, 800)
  }

  const handleAnomalyDetection = () => {
    onRequestAnomalies?.()
    setLoadingAction('anomalies')
    setTimeout(() => {
      const amounts = transactions.map((t) => Math.abs(t.amount_cents))
      const avg = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0
      const threshold = avg * 2.5
      const found = transactions.filter((t) => Math.abs(t.amount_cents) > threshold)
      setAnomalies(
        found.length
          ? found.map(
              (t) =>
                `${t.description}: ${(Math.abs(t.amount_cents) / 100).toFixed(2)} (unusual size)`
            )
          : ['No significant anomalies detected.']
      )
      setLoadingAction(null)
    }, 800)
  }

  const handleProfitabilityByClient = () => {
    onRequestProfitability?.()
    setLoadingAction('profitability')
    setTimeout(() => {
      const byClient: Record<string, number> = {}
      transactions.forEach((t) => {
        const key = t.project_client ?? 'Uncategorized'
        if (!byClient[key]) byClient[key] = 0
        byClient[key] += t.amount_cents
      })
      setProfitability(
        Object.entries(byClient)
          .map(([client, profit_cents]) => ({ client, profit_cents }))
          .sort((a, b) => b.profit_cents - a.profit_cents)
      )
      setLoadingAction(null)
    }, 800)
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Finance AI tools
          </CardTitle>
          <CardDescription>
            Monthly summary, anomaly detection, profitability by client.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Finance AI tools
        </CardTitle>
        <CardDescription>
          Monthly summary, anomaly detection, profitability by client.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMonthlySummary}
            disabled={loadingAction !== null}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <FileText className="mr-2 h-4 w-4" />
            {loadingAction === 'summary' ? 'Generating…' : 'Monthly summary'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnomalyDetection}
            disabled={loadingAction !== null}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {loadingAction === 'anomalies' ? 'Checking…' : 'Anomaly detection'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleProfitabilityByClient}
            disabled={loadingAction !== null}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            {loadingAction === 'profitability' ? 'Calculating…' : 'Profitability by client'}
          </Button>
        </div>

        {summary && (
          <div className="rounded-lg border border-border bg-card-secondary p-4 animate-fade-in">
            <p className="text-sm font-medium text-foreground mb-1">Monthly summary</p>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </div>
        )}
        {anomalies.length > 0 && (
          <div className="rounded-lg border border-border bg-card-secondary p-4 animate-fade-in">
            <p className="text-sm font-medium text-foreground mb-2">Anomaly detection</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {anomalies.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}
        {profitability.length > 0 && (
          <div className="rounded-lg border border-border bg-card-secondary p-4 animate-fade-in">
            <p className="text-sm font-medium text-foreground mb-2">Profitability by client</p>
            <ul className="space-y-2">
              {profitability.map(({ client, profit_cents }) => (
                <li
                  key={client}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">{client}</span>
                  <span
                    className={cn(
                      'font-medium',
                      profit_cents >= 0 ? 'text-atlas-cyan' : 'text-destructive'
                    )}
                  >
                    {(profit_cents / 100).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!summary && !anomalies.length && profitability.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Run a tool above to see monthly summary, anomalies, or profitability by client.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
