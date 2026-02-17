import { api } from '@/lib/api'
import type {
  FinanceCockpit,
  FinanceTransaction,
  FinanceInvoice,
} from '@/types/finance-cockpit'

const BASE = '/finance-cockpit'
const TRANSACTIONS = `${BASE}/transactions`
const INVOICES = `${BASE}/invoices`

export const financeCockpitApi = {
  list: () => api.get<FinanceCockpit[]>(BASE),
  get: (id: string) => api.get<FinanceCockpit>(`${BASE}/${id}`),
  create: (data: Pick<FinanceCockpit, 'title' | 'description' | 'status'>) =>
    api.post<FinanceCockpit>(BASE, data),
  update: (
    id: string,
    data: Partial<Pick<FinanceCockpit, 'title' | 'description' | 'status'>>
  ) => api.patch<FinanceCockpit>(`${BASE}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),
}

export const financeTransactionsApi = {
  list: (params?: { project_client?: string; type?: string }) => {
    const search = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v != null) as [string, string][]
        ).toString()
      : ''
    return api.get<FinanceTransaction[]>(
      search ? `${TRANSACTIONS}?${search}` : TRANSACTIONS
    )
  },
  create: (data: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<FinanceTransaction>(TRANSACTIONS, data),
  update: (
    id: string,
    data: Partial<Pick<FinanceTransaction, 'date' | 'description' | 'amount_cents' | 'type' | 'category' | 'project_client'>>
  ) => api.patch<FinanceTransaction>(`${TRANSACTIONS}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${TRANSACTIONS}/${id}`),
}

export const financeInvoicesApi = {
  list: () => api.get<FinanceInvoice[]>(INVOICES),
  create: (data: Omit<FinanceInvoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<FinanceInvoice>(INVOICES, data),
  update: (
    id: string,
    data: Partial<Pick<FinanceInvoice, 'reference' | 'client_name' | 'amount_cents' | 'status' | 'due_date' | 'paid_at'>>
  ) => api.patch<FinanceInvoice>(`${INVOICES}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${INVOICES}/${id}`),
}
