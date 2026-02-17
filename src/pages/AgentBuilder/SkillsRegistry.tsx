import { useEffect, useCallback, useState } from 'react'
import { toast } from 'sonner'
import {
  AgentCreationForm,
  SkillRegistry,
  MemoryViewer,
  ApprovalPolicySettings,
  TestConsole,
} from '@/components/agent-builder-skills-registry'
import {
  useAgentBuilderSkillsRegistries,
  useCreateAgentBuilderSkillsRegistry,
} from '@/hooks/useAgentBuilderSkillsRegistry'
import type {
  AgentFormValues,
  Skill,
  MemoryEntry,
  ApprovalPolicy,
  TestConsoleLog,
} from '@/types/agent-builder-skills-registry'

/** Mock skills for the registry when API has none */
const MOCK_SKILLS: Skill[] = [
  {
    id: 'skill-search',
    name: 'Web Search',
    description: 'Search the web for current information.',
    permission_level: 'read',
    category: 'Research',
    installed: true,
  },
  {
    id: 'skill-calendar',
    name: 'Calendar',
    description: 'Read and create calendar events.',
    permission_level: 'write',
    category: 'Productivity',
    installed: true,
  },
  {
    id: 'skill-code',
    name: 'Code Runner',
    description: 'Execute code in a sandbox.',
    permission_level: 'admin',
    category: 'Development',
    installed: false,
  },
]

function uuid() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function SkillsRegistryPage() {
  const { data: registries = [] } = useAgentBuilderSkillsRegistries()
  const createMutation = useCreateAgentBuilderSkillsRegistry()

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [allowedSkillIds, setAllowedSkillIds] = useState<string[]>([])
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([])
  const [approvalPolicy, setApprovalPolicy] = useState<ApprovalPolicy | null>(null)
  const [testLogs, setTestLogs] = useState<TestConsoleLog[]>([])
  const [isTestRunning, setTestRunning] = useState(false)
  const [skills] = useState<Skill[]>(MOCK_SKILLS)

  useEffect(() => {
    document.title = 'Agent Builder & Skills Registry | Atlas'
    return () => {
      document.title = 'Atlas'
    }
  }, [])

  useEffect(() => {
    if (registries.length > 0 && !selectedAgentId) {
      setSelectedAgentId(registries[0].id)
      const first = registries[0]
      setApprovalPolicy((prev) =>
        prev?.agent_id === first.id
          ? prev
          : {
              agent_id: first.id,
              human_in_loop: false,
              require_approval_for_skills: [],
              rate_limit_requests_per_minute: 10,
              rate_limit_requests_per_day: 500,
            }
      )
    }
  }, [registries, selectedAgentId])

  const selectedAgent = registries.find((r) => r.id === selectedAgentId)
  const agentMemory = memoryEntries.filter((e) => e.agent_id === (selectedAgentId ?? ''))
  const policyForAgent =
    approvalPolicy?.agent_id === selectedAgentId ? approvalPolicy : null

  const handleAgentFormSubmit = useCallback(
    (values: AgentFormValues) => {
      createMutation.mutate(
        {
          title: values.name,
          description: values.role_instructions,
          status: 'active',
        },
        {
          onSuccess: (created) => {
            setSelectedAgentId(created.id)
            setApprovalPolicy({
              agent_id: created.id,
              human_in_loop: false,
              require_approval_for_skills: [],
              rate_limit_requests_per_minute: 10,
              rate_limit_requests_per_day: 500,
            })
          },
        }
      )
    },
    [createMutation]
  )

  const handleToggleSkill = useCallback((skillId: string) => {
    setAllowedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    )
  }, [])

  const handlePurgeEntry = useCallback((entryId: string) => {
    setMemoryEntries((prev) => prev.filter((e) => e.id !== entryId))
    toast.success('Memory entry purged')
  }, [])

  const handlePurgeAllMemory = useCallback(() => {
    if (!selectedAgentId) return
    setMemoryEntries((prev) => prev.filter((e) => e.agent_id !== selectedAgentId))
    toast.success('All memory entries purged')
  }, [selectedAgentId])

  const handleToggleHumanInLoop = useCallback((enabled: boolean) => {
    setApprovalPolicy((prev) =>
      prev ? { ...prev, human_in_loop: enabled } : null
    )
  }, [])

  const handleRateLimitChange = useCallback(
    (field: 'per_minute' | 'per_day', value: number) => {
      setApprovalPolicy((prev) =>
        prev
          ? {
              ...prev,
              rate_limit_requests_per_minute:
                field === 'per_minute' ? value : prev.rate_limit_requests_per_minute,
              rate_limit_requests_per_day:
                field === 'per_day' ? value : prev.rate_limit_requests_per_day,
            }
          : null
      )
    },
    []
  )

  const handleRunTest = useCallback((prompt: string) => {
    if (!selectedAgentId) return
    setTestRunning(true)
    const id = uuid()
    const timestamp = new Date().toISOString()
    setTimeout(() => {
      setTestLogs((prev) => [
        ...prev,
        {
          id,
          prompt,
          response: `Simulated response for: "${prompt.slice(0, 50)}..."`,
          timestamp,
          status: 'success',
        },
      ])
      setTestRunning(false)
    }, 800)
  }, [selectedAgentId])

  const handleClearLogs = useCallback(() => {
    setTestLogs([])
    toast.success('Logs cleared')
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up motion-reduce:animate-none">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Agent Builder & Skills Registry
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create custom agents, configure instructions, assign skills, set memory scope and approval policies.
          </p>
        </div>
        {registries.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="agent-select" className="text-sm font-medium text-muted-foreground shrink-0">
              Agent:
            </label>
            <select
              id="agent-select"
              value={selectedAgentId ?? ''}
              onChange={(e) => {
                const id = e.target.value || null
                setSelectedAgentId(id)
                if (id && (!approvalPolicy || approvalPolicy.agent_id !== id)) {
                  setApprovalPolicy({
                    agent_id: id,
                    human_in_loop: false,
                    require_approval_for_skills: [],
                    rate_limit_requests_per_minute: 10,
                    rate_limit_requests_per_day: 500,
                  })
                }
              }}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[180px]"
              aria-label="Select agent"
            >
              {registries.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <AgentCreationForm
          allowedSkillIds={allowedSkillIds}
          onSelectSkills={() => toast.info('Skill picker would open here')}
          onSubmit={handleAgentFormSubmit}
          isLoading={createMutation.isPending}
        />
        <ApprovalPolicySettings
          policy={policyForAgent}
          onToggleHumanInLoop={handleToggleHumanInLoop}
          onRateLimitChange={handleRateLimitChange}
          disabled={!selectedAgentId}
        />
      </div>

      <SkillRegistry
        skills={skills}
        selectedSkillIds={allowedSkillIds}
        onToggleSkill={handleToggleSkill}
        onInstall={(id) => toast.success(`Skill ${id} installed`)}
        emptyMessage="No skills in the registry. Install skills to assign to agents."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MemoryViewer
          agentId={selectedAgentId}
          agentName={selectedAgent?.title}
          entries={agentMemory}
          onPurgeEntry={handlePurgeEntry}
          onPurgeAll={handlePurgeAllMemory}
          emptyMessage="No memory entries for this agent."
        />
        <TestConsole
          agentId={selectedAgentId}
          logs={testLogs}
          onRun={handleRunTest}
          onClearLogs={handleClearLogs}
          isRunning={isTestRunning}
          disabled={!selectedAgentId}
        />
      </div>
    </div>
  )
}
