import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agentBuilderSkillsRegistryApi } from '@/api/agent-builder-skills-registry'
import { toast } from 'sonner'
import type { AgentBuilderSkillsRegistry } from '@/types/agent-builder-skills-registry'

export const agentBuilderSkillsRegistryKeys = {
  all: ['agent-builder-skills-registry'] as const,
  lists: () => [...agentBuilderSkillsRegistryKeys.all, 'list'] as const,
  list: (status?: string) => [...agentBuilderSkillsRegistryKeys.lists(), status] as const,
  details: () => [...agentBuilderSkillsRegistryKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentBuilderSkillsRegistryKeys.details(), id] as const,
}

export function useAgentBuilderSkillsRegistries(status?: string) {
  return useQuery({
    queryKey: agentBuilderSkillsRegistryKeys.list(status),
    queryFn: () => agentBuilderSkillsRegistryApi.list(),
    select: (list) => (status ? list.filter((p) => p.status === status) : list),
  })
}

export function useAgentBuilderSkillsRegistry(id: string) {
  return useQuery({
    queryKey: agentBuilderSkillsRegistryKeys.detail(id),
    queryFn: () => agentBuilderSkillsRegistryApi.get(id),
    enabled: !!id,
  })
}

export function useCreateAgentBuilderSkillsRegistry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Pick<AgentBuilderSkillsRegistry, 'title' | 'description' | 'status'>) =>
      agentBuilderSkillsRegistryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentBuilderSkillsRegistryKeys.lists() })
      toast.success('Agent saved')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to save')
    },
  })
}

export function useUpdateAgentBuilderSkillsRegistry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Pick<AgentBuilderSkillsRegistry, 'title' | 'description' | 'status'>>
    }) => agentBuilderSkillsRegistryApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(agentBuilderSkillsRegistryKeys.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: agentBuilderSkillsRegistryKeys.lists() })
      toast.success('Agent updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update')
    },
  })
}

export function useDeleteAgentBuilderSkillsRegistry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => agentBuilderSkillsRegistryApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: agentBuilderSkillsRegistryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: agentBuilderSkillsRegistryKeys.lists() })
      toast.success('Agent removed')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete')
    },
  })
}
