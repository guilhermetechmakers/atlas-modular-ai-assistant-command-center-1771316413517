import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contentPipelineApi } from '@/api/content-pipeline'
import { toast } from 'sonner'
import type { ContentPipeline } from '@/types/content-pipeline'

export const contentPipelineKeys = {
  all: ['content-pipeline'] as const,
  lists: () => [...contentPipelineKeys.all, 'list'] as const,
  list: (status?: string) => [...contentPipelineKeys.lists(), status] as const,
  details: () => [...contentPipelineKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentPipelineKeys.details(), id] as const,
}

export function useContentPipelines(status?: string) {
  return useQuery({
    queryKey: contentPipelineKeys.list(status),
    queryFn: () => contentPipelineApi.list(),
    select: (list) =>
      status ? list.filter((p) => p.status === status) : list,
  })
}

export function useContentPipeline(id: string) {
  return useQuery({
    queryKey: contentPipelineKeys.detail(id),
    queryFn: () => contentPipelineApi.get(id),
    enabled: !!id,
  })
}

export function useCreateContentPipeline() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Pick<ContentPipeline, 'title' | 'description' | 'status'>) =>
      contentPipelineApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentPipelineKeys.lists() })
      toast.success('Saved to pipeline')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to save')
    },
  })
}

export function useUpdateContentPipeline() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Pick<ContentPipeline, 'title' | 'description' | 'status'>>
    }) => contentPipelineApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(contentPipelineKeys.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: contentPipelineKeys.lists() })
      toast.success('Pipeline updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update')
    },
  })
}

export function useDeleteContentPipeline() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => contentPipelineApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: contentPipelineKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: contentPipelineKeys.lists() })
      toast.success('Removed from pipeline')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete')
    },
  })
}
