import { useState, useRef } from 'react'
import {
  Receipt,
  Plus,
  Upload,
  Filter,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { FinanceTransaction, TransactionType } from '@/types/finance-cockpit'

export interface TransactionsLedgerProps {
  transactions: FinanceTransaction[]
  isLoading?: boolean
  onAdd?: (tx: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  onDelete?: (id: string) => void
  onImportCsv?: (rows: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => void
}

const DEFAULT_CATEGORIES = ['Software', 'Marketing', 'Payroll', 'Contractor', 'Other']
const TYPE_LABELS: Record<TransactionType, string> = {
  income: 'Income',
  expense: 'Expense',
}

export function TransactionsLedger({
  transactions,
  isLoading = false,
  onAdd,
  onDelete,
  onImportCsv,
}: TransactionsLedgerProps) {
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all')
  const [filterProject, setFilterProject] = useState('')
  const [search, setSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formDate, setFormDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  )
  const [formDesc, setFormDesc] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formType, setFormType] = useState<TransactionType>('expense')
  const [formCategory, setFormCategory] = useState('')
  const [formProject, setFormProject] = useState('')

  const filtered = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false
    if (
      filterProject &&
      !(t.project_client ?? '').toLowerCase().includes(filterProject.toLowerCase())
    )
      return false
    if (
      search &&
      ![
        t.description,
        t.category,
        t.project_client,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false
    return true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Math.round(parseFloat(formAmount) * 100)
    if (Number.isNaN(amount) || !formDesc.trim()) return
    onAdd?.({
      date: formDate,
      description: formDesc.trim(),
      amount_cents: formType === 'income' ? amount : -Math.abs(amount),
      type: formType,
      category: formCategory.trim() || undefined,
      project_client: formProject.trim() || undefined,
    })
    setFormDesc('')
    setFormAmount('')
    setFormCategory('')
    setFormProject('')
    setShowForm(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result)
      const lines = text.split(/\r?\n/).filter(Boolean)
      const header = lines[0].toLowerCase()
      const dateIdx = header.includes('date') ? header.split(',').findIndex((h) => h.includes('date')) : 0
      const descIdx = header.includes('description') ? header.split(',').findIndex((h) => h.includes('description')) : 1
      const amountIdx = header.includes('amount') ? header.split(',').findIndex((h) => h.includes('amount')) : 2
      const typeIdx = header.includes('type') ? header.split(',').findIndex((h) => h.includes('type')) : -1
      const categoryIdx = header.includes('category') ? header.split(',').findIndex((h) => h.includes('category')) : -1
      const projectIdx = header.includes('project') || header.includes('client') ? header.split(',').findIndex((h) => h.includes('project') || h.includes('client')) : -1
      const rows: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = []
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map((c) => c.trim())
        const date = cells[dateIdx] || new Date().toISOString().slice(0, 10)
        const desc = cells[descIdx] ?? ''
        const rawAmount = cells[amountIdx] ?? '0'
        const amount = Math.round(parseFloat(String(rawAmount).replace(/[^0-9.-]/g, '')) * 100)
        const typeVal = (cells[typeIdx] ?? 'expense').toLowerCase()
        const type: TransactionType = typeVal === 'income' ? 'income' : 'expense'
        const amountCents = type === 'income' ? amount : -Math.abs(amount)
        rows.push({
          date,
          description: desc || 'Imported',
          amount_cents: amountCents,
          type,
          category: categoryIdx >= 0 ? cells[categoryIdx] : undefined,
          project_client: projectIdx >= 0 ? cells[projectIdx] : undefined,
        })
      }
      onImportCsv?.(rows)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Transactions ledger
          </CardTitle>
          <CardDescription>
            Import CSV, manual add, categorize, filter by project/client.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Transactions ledger
          </CardTitle>
          <CardDescription>
            Import CSV, manual add, categorize, filter by project/client.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Import CSV"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add transaction
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
              className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Filter by type"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <Input
              placeholder="Project/Client"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-36"
            />
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-border bg-card-secondary p-4 space-y-4 animate-fade-in"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="ledger-date">Date</Label>
                <Input
                  id="ledger-date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ledger-desc">Description</Label>
                <Input
                  id="ledger-desc"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Description"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ledger-amount">Amount</Label>
                <Input
                  id="ledger-amount"
                  type="number"
                  step="0.01"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ledger-type">Type</Label>
                <select
                  id="ledger-type"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as TransactionType)}
                  className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <Label htmlFor="ledger-category">Category</Label>
                <select
                  id="ledger-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                >
                  <option value="">—</option>
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="ledger-project">Project / Client</Label>
                <Input
                  id="ledger-project"
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  placeholder="Optional"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">No transactions</p>
            <p className="text-sm text-muted-foreground mt-1">
              Import a CSV or add a transaction manually.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add transaction
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card-secondary sticky top-0">
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-left p-3 font-medium">Category</th>
                    <th className="text-left p-3 font-medium">Project / Client</th>
                    <th className="text-right p-3 font-medium">Amount</th>
                    <th className="w-10 p-3" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-border hover:bg-card-secondary/50 transition-colors duration-200"
                    >
                      <td className="p-3 text-muted-foreground">{t.date}</td>
                      <td className="p-3 font-medium">{t.description}</td>
                      <td className="p-3">
                        {t.category ? (
                          <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground">{t.project_client ?? '—'}</td>
                      <td className="p-3 text-right font-medium">
                        <span
                          className={cn(
                            t.amount_cents >= 0
                              ? 'text-atlas-cyan'
                              : 'text-destructive'
                          )}
                        >
                          {t.amount_cents >= 0 ? (
                            <ArrowDownLeft className="inline h-4 w-4 mr-1 align-middle" />
                          ) : (
                            <ArrowUpRight className="inline h-4 w-4 mr-1 align-middle" />
                          )}
                          {(t.amount_cents / 100).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3">
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onDelete(t.id)}
                            aria-label="Delete transaction"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
