import { useMemo } from 'react'
import { TrendingUp, Wallet, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { FinanceTransaction, BudgetRunwayPoint } from '@/types/finance-cockpit'

export interface BudgetRunwayChartProps {
  transactions: FinanceTransaction[]
  isLoading?: boolean
}

function aggregateByMonth(transactions: FinanceTransaction[]): BudgetRunwayPoint[] {
  const byMonth: Record<string, { income: number; expenses: number }> = {}
  transactions.forEach((t) => {
    const month = t.date.slice(0, 7)
    if (!byMonth[month]) byMonth[month] = { income: 0, expenses: 0 }
    if (t.amount_cents >= 0) byMonth[month].income += t.amount_cents
    else byMonth[month].expenses += Math.abs(t.amount_cents)
  })
  const sorted = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b))
  let running = 0
  return sorted.map(([month, { income, expenses }]) => {
    const balance = (income - expenses) / 100
    running += balance
    const monthlyBurn = expenses / 100
    const runwayMonths = monthlyBurn > 0 ? Math.max(0, running / monthlyBurn) : undefined
    return {
      month: `${month.slice(5)}/${month.slice(2, 4)}`,
      income: income / 100,
      expenses: expenses / 100,
      balance: running,
      runwayMonths: runwayMonths !== undefined ? Math.round(runwayMonths * 10) / 10 : undefined,
    }
  })
}

export function BudgetRunwayChart({ transactions, isLoading = false }: BudgetRunwayChartProps) {
  const chartData = useMemo(() => aggregateByMonth(transactions), [transactions])
  const totals = useMemo(() => {
    let income = 0
    let expenses = 0
    transactions.forEach((t) => {
      if (t.amount_cents >= 0) income += t.amount_cents
      else expenses += Math.abs(t.amount_cents)
    })
    const balance = income - expenses
    const monthlyExpenses =
      transactions.length > 0
        ? transactions
            .filter((t) => t.amount_cents < 0)
            .reduce((s, t) => s + Math.abs(t.amount_cents), 0) / 100
        : 0
    const runwayMonths = monthlyExpenses > 0 ? balance / 100 / monthlyExpenses : 0
    return {
      income: income / 100,
      expenses: expenses / 100,
      balance: balance / 100,
      runwayMonths: Math.round(runwayMonths * 10) / 10,
    }
  }, [transactions])

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Budget & runway
          </CardTitle>
          <CardDescription>Simple projections based on income/expenses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Budget & runway
        </CardTitle>
        <CardDescription>Simple projections based on income/expenses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card-secondary/50">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-atlas-cyan" />
                Runway
              </CardDescription>
              <CardTitle className="text-2xl">
                {totals.runwayMonths > 0 ? `${totals.runwayMonths} mo` : '—'}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border bg-card-secondary/50">
            <CardHeader className="pb-2">
              <CardDescription>Income (total)</CardDescription>
              <CardTitle className="text-2xl text-atlas-cyan">
                {totals.income.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border bg-card-secondary/50">
            <CardHeader className="pb-2">
              <CardDescription>Expenses (total)</CardDescription>
              <CardTitle className="text-2xl text-destructive">
                {totals.expenses.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border bg-card-secondary/50">
            <CardHeader className="pb-2">
              <CardDescription>Balance</CardDescription>
              <CardTitle className="text-2xl">
                {totals.balance >= 0 ? (
                  <span className="text-atlas-cyan">{totals.balance.toFixed(2)}</span>
                ) : (
                  <span className="text-destructive">{totals.balance.toFixed(2)}</span>
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">No data yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add transactions to see budget and runway projections.
            </p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(34, 211, 238)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="rgb(34, 211, 238)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value.toFixed(2), '']}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="rgb(34, 211, 238)"
                  fill="url(#fillIncome)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="rgb(239, 68, 68)"
                  fill="url(#fillExpenses)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
