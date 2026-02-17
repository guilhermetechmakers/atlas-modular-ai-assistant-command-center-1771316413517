/**
 * Types for Agent Builder / Skills Registry.
 * Aligns with agent_builder_skills_registry and related domain models.
 */

/** API/DB record shape (table agent_builder_skills_registry) */
export interface AgentBuilderSkillsRegistry {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** @deprecated use AgentBuilderSkillsRegistry */
export type AgentBuilderSkillsRegistryRecord = AgentBuilderSkillsRegistry

export type AgentTone = 'professional' | 'friendly' | 'concise' | 'formal' | 'casual'

export type MemoryScope = 'session' | 'conversation' | 'persistent' | 'none'

export interface Agent {
  id: string
  user_id: string
  name: string
  role_instructions: string
  tone: AgentTone
  memory_scope: MemoryScope
  allowed_skill_ids: string[]
  status: string
  created_at: string
  updated_at: string
}

export type SkillPermissionLevel = 'read' | 'write' | 'admin'

export interface Skill {
  id: string
  name: string
  description: string
  permission_level: SkillPermissionLevel
  category?: string
  installed?: boolean
}

export interface MemoryEntry {
  id: string
  agent_id: string
  key: string
  value: string
  created_at: string
}

export interface ApprovalPolicy {
  agent_id: string
  human_in_loop: boolean
  require_approval_for_skills: string[]
  rate_limit_requests_per_minute: number
  rate_limit_requests_per_day: number
}

export interface TestConsoleLog {
  id: string
  prompt: string
  response: string
  timestamp: string
  status: 'success' | 'error'
}
