/**
 * Finance Cockpit types aligned with DB schema and UI models.
 */

export interface FinanceCockpit {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export type TransactionType = 'income' | 'expense'

export interface FinanceTransaction {
  id: string
  user_id?: string
  date: string
  description: string
  amount_cents: number
  type: TransactionType
  category?: string
  project_client?: string
  created_at: string
  updated_at: string
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface FinanceInvoice {
  id: string
  user_id?: string
  reference: string
  client_name?: string
  amount_cents: number
  status: InvoiceStatus
  due_date?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface BudgetRunwayPoint {
  month: string
  income: number
  expenses: number
  balance: number
  runwayMonths?: number
}

export interface FinanceAISummary {
  monthlySummary?: string
  anomalies?: string[]
  profitabilityByClient?: { client: string; profit_cents: number }[]
}
