import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { researchKnowledgeBaseApi } from '@/api/research-knowledge-base'
import { toast } from 'sonner'
import type { ResearchKnowledgeBase } from '@/types/research-knowledge-base'

export const researchKnowledgeBaseKeys = {
  all: ['research-knowledge-base'] as const,
  lists: () => [...researchKnowledgeBaseKeys.all, 'list'] as const,
  list: (status?: string) => [...researchKnowledgeBaseKeys.lists(), status] as const,
  details: () => [...researchKnowledgeBaseKeys.all, 'detail'] as const,
  detail: (id: string) => [...researchKnowledgeBaseKeys.details(), id] as const,
}

export function useResearchKnowledgeBases(status?: string) {
  return useQuery({
    queryKey: researchKnowledgeBaseKeys.list(status),
    queryFn: () => researchKnowledgeBaseApi.list(),
    select: (list) =>
      status ? list.filter((p) => p.status === status) : list,
  })
}

export function useResearchKnowledgeBase(id: string) {
  return useQuery({
    queryKey: researchKnowledgeBaseKeys.detail(id),
    queryFn: () => researchKnowledgeBaseApi.get(id),
    enabled: !!id,
  })
}

export function useCreateResearchKnowledgeBase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Pick<ResearchKnowledgeBase, 'title' | 'description' | 'status'>) =>
      researchKnowledgeBaseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKnowledgeBaseKeys.lists() })
      toast.success('Note saved')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to save')
    },
  })
}

export function useUpdateResearchKnowledgeBase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Pick<ResearchKnowledgeBase, 'title' | 'description' | 'status'>>
    }) => researchKnowledgeBaseApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(researchKnowledgeBaseKeys.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: researchKnowledgeBaseKeys.lists() })
      toast.success('Note updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update')
    },
  })
}

export function useDeleteResearchKnowledgeBase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => researchKnowledgeBaseApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: researchKnowledgeBaseKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: researchKnowledgeBaseKeys.lists() })
      toast.success('Note removed')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete')
    },
  })
}
