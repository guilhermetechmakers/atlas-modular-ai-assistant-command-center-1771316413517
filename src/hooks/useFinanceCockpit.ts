import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  financeCockpitApi,
  financeTransactionsApi,
  financeInvoicesApi,
} from '@/api/finance-cockpit'
import { toast } from 'sonner'
import type {
  FinanceCockpit,
  FinanceTransaction,
  FinanceInvoice,
} from '@/types/finance-cockpit'

export const financeCockpitKeys = {
  all: ['finance-cockpit'] as const,
  lists: () => [...financeCockpitKeys.all, 'list'] as const,
  list: (status?: string) => [...financeCockpitKeys.lists(), status] as const,
  details: () => [...financeCockpitKeys.all, 'detail'] as const,
  detail: (id: string) => [...financeCockpitKeys.details(), id] as const,
  transactions: (filter?: { project_client?: string; type?: string }) =>
    [...financeCockpitKeys.all, 'transactions', filter] as const,
  invoices: () => [...financeCockpitKeys.all, 'invoices'] as const,
}

export function useFinanceCockpits(status?: string) {
  return useQuery({
    queryKey: financeCockpitKeys.list(status),
    queryFn: () => financeCockpitApi.list(),
    select: (list) =>
      status ? list.filter((p) => p.status === status) : list,
  })
}

export function useFinanceTransactions(filter?: {
  project_client?: string
  type?: string
}) {
  return useQuery({
    queryKey: financeCockpitKeys.transactions(filter),
    queryFn: () => financeTransactionsApi.list(filter),
  })
}

export function useFinanceInvoices() {
  return useQuery({
    queryKey: financeCockpitKeys.invoices(),
    queryFn: () => financeInvoicesApi.list(),
  })
}

export function useCreateFinanceTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      data: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ) => financeTransactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeCockpitKeys.all })
      toast.success('Transaction added')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to add transaction')
    },
  })
}

export function useUpdateFinanceTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<
        Pick<
          FinanceTransaction,
          'date' | 'description' | 'amount_cents' | 'type' | 'category' | 'project_client'
        >
      >
    }) => financeTransactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeCockpitKeys.all })
      toast.success('Transaction updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update')
    },
  })
}

export function useDeleteFinanceTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => financeTransactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeCockpitKeys.all })
      toast.success('Transaction removed')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete')
    },
  })
}

export function useCreateFinanceInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      data: Omit<FinanceInvoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ) => financeInvoicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeCockpitKeys.invoices() })
      toast.success('Invoice added')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to add invoice')
    },
  })
}

export function useUpdateFinanceInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<
        Pick<
          FinanceInvoice,
          'reference' | 'client_name' | 'amount_cents' | 'status' | 'due_date' | 'paid_at'
        >
      >
    }) => financeInvoicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeCockpitKeys.invoices() })
      toast.success('Invoice updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update')
    },
  })
}

export function useDeleteFinanceInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => financeInvoicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeCockpitKeys.invoices() })
      toast.success('Invoice removed')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete')
    },
  })
}
