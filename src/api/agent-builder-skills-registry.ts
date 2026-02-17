import { api } from '@/lib/api'
import type { AgentBuilderSkillsRegistry } from '@/types/agent-builder-skills-registry'

const BASE = '/agent-builder-skills-registry'

export const agentBuilderSkillsRegistryApi = {
  list: () => api.get<AgentBuilderSkillsRegistry[]>(BASE),
  get: (id: string) => api.get<AgentBuilderSkillsRegistry>(`${BASE}/${id}`),
  create: (data: Pick<AgentBuilderSkillsRegistry, 'title' | 'description' | 'status'>) =>
    api.post<AgentBuilderSkillsRegistry>(BASE, data),
  update: (
    id: string,
    data: Partial<Pick<AgentBuilderSkillsRegistry, 'title' | 'description' | 'status'>>
  ) => api.patch<AgentBuilderSkillsRegistry>(`${BASE}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),
}
