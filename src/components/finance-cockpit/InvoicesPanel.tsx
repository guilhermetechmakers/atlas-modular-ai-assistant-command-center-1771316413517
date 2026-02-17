import { useState } from 'react'
import { FileText, Plus, MoreHorizontal, Check, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { FinanceInvoice, InvoiceStatus } from '@/types/finance-cockpit'

export interface InvoicesPanelProps {
  invoices: FinanceInvoice[]
  isLoading?: boolean
  onAdd?: (inv: Omit<FinanceInvoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  onStatusChange?: (id: string, status: InvoiceStatus) => void
  onDelete?: (id: string) => void
}

const STATUS_OPTIONS: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue', 'cancelled']
const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}
const STATUS_VARIANTS: Record<InvoiceStatus, 'default' | 'secondary' | 'outline' | 'success' | 'warning'> = {
  draft: 'outline',
  sent: 'secondary',
  paid: 'success',
  overdue: 'warning',
  cancelled: 'outline',
}

export function InvoicesPanel({
  invoices,
  isLoading = false,
  onAdd,
  onStatusChange,
  onDelete,
}: InvoicesPanelProps) {
  const [showForm, setShowForm] = useState(false)
  const [reference, setReference] = useState('')
  const [clientName, setClientName] = useState('')
  const [amountCents, setAmountCents] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Math.round(parseFloat(amountCents) * 100)
    if (Number.isNaN(amount) || !reference.trim()) return
    onAdd?.({
      reference: reference.trim(),
      client_name: clientName.trim() || undefined,
      amount_cents: amount,
      status: 'draft',
      due_date: dueDate.trim() || undefined,
    })
    setReference('')
    setClientName('')
    setAmountCents('')
    setDueDate('')
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Invoices
          </CardTitle>
          <CardDescription>Invoice entries with manual status updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Invoices
          </CardTitle>
          <CardDescription>Invoice entries with manual status updates.</CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="transition-transform duration-200 hover:scale-[1.02]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add invoice
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-border bg-card-secondary p-4 space-y-4 animate-fade-in"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="inv-reference">Reference</Label>
                <Input
                  id="inv-reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="INV-001"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="inv-client">Client</Label>
                <Input
                  id="inv-client"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="inv-amount">Amount</Label>
                <Input
                  id="inv-amount"
                  type="number"
                  step="0.01"
                  value={amountCents}
                  onChange={(e) => setAmountCents(e.target.value)}
                  placeholder="0.00"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="inv-due">Due date</Label>
                <Input
                  id="inv-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Create invoice</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">No invoices</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add an invoice to track status and payments.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add invoice
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {invoices.map((inv) => (
              <li
                key={inv.id}
                className={cn(
                  'flex flex-wrap items-center gap-3 rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-card',
                  'sm:flex-nowrap'
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{inv.reference}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {inv.client_name ?? '—'} · {(inv.amount_cents / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={inv.status}
                    onChange={(e) => onStatusChange?.(inv.id, e.target.value as InvoiceStatus)}
                    className="h-9 rounded-md border border-input bg-background px-2 py-1 text-sm focus:ring-2 focus:ring-ring"
                    aria-label="Update status"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <Badge variant={STATUS_VARIANTS[inv.status]} className="shrink-0">
                    {inv.status === 'paid' && <Check className="h-3 w-3 mr-1" />}
                    {inv.status === 'overdue' && <Clock className="h-3 w-3 mr-1" />}
                    {inv.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                    {STATUS_LABELS[inv.status]}
                  </Badge>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => onDelete(inv.id)}
                      aria-label="Delete invoice"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
