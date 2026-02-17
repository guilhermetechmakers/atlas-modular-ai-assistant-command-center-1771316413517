import { useState, useCallback, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TransactionsLedger,
  InvoicesPanel,
  BudgetRunwayChart,
  FinanceAITools,
  ExportImportControls,
} from '@/components/finance-cockpit'
import { toast } from 'sonner'
import type {
  FinanceTransaction,
  FinanceInvoice,
  InvoiceStatus,
} from '@/types/finance-cockpit'

function uuid() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function FinancePage() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([])
  const [invoices, setInvoices] = useState<FinanceInvoice[]>([])
  const [isLoading] = useState(false)

  useEffect(() => {
    document.title = 'Finance Cockpit | Atlas'
    return () => {
      document.title = 'Atlas'
    }
  }, [])

  const handleAddTransaction = useCallback(
    (tx: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const now = new Date().toISOString()
      setTransactions((prev) => [
        {
          ...tx,
          id: uuid(),
          created_at: now,
          updated_at: now,
        },
        ...prev,
      ])
      toast.success('Transaction added')
    },
    []
  )

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    toast.success('Transaction removed')
  }, [])

  const handleImportCsv = useCallback(
    (rows: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => {
      const now = new Date().toISOString()
      const newTx = rows.map((r) => ({
        ...r,
        id: uuid(),
        created_at: now,
        updated_at: now,
      }))
      setTransactions((prev) => [...newTx, ...prev])
      toast.success(`${rows.length} transaction(s) imported`)
    },
    []
  )

  const handleAddInvoice = useCallback(
    (inv: Omit<FinanceInvoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const now = new Date().toISOString()
      setInvoices((prev) => [
        {
          ...inv,
          id: uuid(),
          created_at: now,
          updated_at: now,
        },
        ...prev,
      ])
      toast.success('Invoice added')
    },
    []
  )

  const handleInvoiceStatusChange = useCallback((id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status, updated_at: new Date().toISOString() } : i))
    )
    toast.success('Invoice updated')
  }, [])

  const handleDeleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id))
    toast.success('Invoice removed')
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Finance Cockpit
          </h1>
          <p className="mt-1 text-muted-foreground">
            Ledger-style view for CSV imports, categorization, invoicing, budgets, and runway.
          </p>
        </div>
      </div>

      <Tabs defaultValue="ledger" className="w-full">
        <TabsList className="flex h-auto flex-wrap gap-1 border border-border bg-card-secondary p-1">
          <TabsTrigger value="ledger">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="budget">Budget & Runway</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
          <TabsTrigger value="export">Export / Import</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="mt-6">
          <TransactionsLedger
            transactions={transactions}
            isLoading={isLoading}
            onAdd={handleAddTransaction}
            onDelete={handleDeleteTransaction}
            onImportCsv={handleImportCsv}
          />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <InvoicesPanel
            invoices={invoices}
            isLoading={isLoading}
            onAdd={handleAddInvoice}
            onStatusChange={handleInvoiceStatusChange}
            onDelete={handleDeleteInvoice}
          />
        </TabsContent>

        <TabsContent value="budget" className="mt-6">
          <BudgetRunwayChart transactions={transactions} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <FinanceAITools
            transactions={transactions}
            invoices={invoices}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ExportImportControls
            transactions={transactions}
            isLoading={isLoading}
            onImport={handleImportCsv}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
