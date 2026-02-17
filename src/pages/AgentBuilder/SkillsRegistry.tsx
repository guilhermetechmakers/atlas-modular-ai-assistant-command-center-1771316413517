import { useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronRight, Bot, AlertCircle } from 'lucide-react'
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
  useUpdateAgentBuilderSkillsRegistry,
  useDeleteAgentBuilderSkillsRegistry,
} from '@/hooks/useAgentBuilderSkillsRegistry'
import type { AgentFormValues } from '@/components/agent-builder-skills-registry'
import type {
  Skill,
  MemoryEntry,
  ApprovalPolicy,
  TestConsoleLog,
} from '@/types/agent-builder-skills-registry'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

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
  const {
    data: registries = [],
    isLoading: registriesLoading,
    isError: registriesError,
    refetch: refetchRegistries,
  } = useAgentBuilderSkillsRegistries()
  const createMutation = useCreateAgentBuilderSkillsRegistry()
  const updateMutation = useUpdateAgentBuilderSkillsRegistry()
  const deleteMutation = useDeleteAgentBuilderSkillsRegistry()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [allowedSkillIds, setAllowedSkillIds] = useState<string[]>([])
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([])
  const [approvalPolicy, setApprovalPolicy] = useState<ApprovalPolicy | null>(null)
  const [testLogs, setTestLogs] = useState<TestConsoleLog[]>([])
  const [isTestRunning, setTestRunning] = useState(false)
  const [skills] = useState<Skill[]>(MOCK_SKILLS)
  const [skillPickerOpen, setSkillPickerOpen] = useState(false)
  const [skillPickerDraft, setSkillPickerDraft] = useState<string[]>([])

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

  const handleAgentUpdate = useCallback(
    (id: string, values: { title: string; description?: string; status: string }) => {
      updateMutation.mutate(
        { id, data: { title: values.title, description: values.description, status: values.status } },
        { onSuccess: () => toast.success('Agent updated') }
      )
    },
    [updateMutation]
  )

  const handleAgentDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setDeleteConfirmId(null)
          if (selectedAgentId === id) {
            const remaining = registries.filter((r) => r.id !== id)
            setSelectedAgentId(remaining[0]?.id ?? null)
            if (approvalPolicy?.agent_id === id) {
              const next = remaining[0]
              setApprovalPolicy(
                next
                  ? {
                      agent_id: next.id,
                      human_in_loop: false,
                      require_approval_for_skills: [],
                      rate_limit_requests_per_minute: 10,
                      rate_limit_requests_per_day: 500,
                    }
                  : null
              )
            }
          }
        },
      })
    },
    [deleteMutation, selectedAgentId, registries, approvalPolicy]
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

  const openSkillPicker = useCallback(() => {
    setSkillPickerDraft([...allowedSkillIds])
    setSkillPickerOpen(true)
  }, [allowedSkillIds])

  const confirmSkillPicker = useCallback(() => {
    setAllowedSkillIds([...skillPickerDraft])
    setSkillPickerOpen(false)
    toast.success('Skills updated')
  }, [skillPickerDraft])

  const toggleSkillInPicker = useCallback((skillId: string) => {
    setSkillPickerDraft((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    )
  }, [])

  if (registriesLoading) {
    return (
      <div className="space-y-6 animate-fade-in-up motion-reduce:animate-none">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          <span className="text-foreground font-medium">Agent Builder</span>
        </nav>
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[420px] w-full rounded-card-lg" />
          <Skeleton className="h-[320px] w-full rounded-card-lg" />
        </div>
        <Skeleton className="h-[280px] w-full rounded-card-lg" />
      </div>
    )
  }

  if (registriesError) {
    return (
      <div className="space-y-6 animate-fade-in-up motion-reduce:animate-none">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          <span className="text-foreground font-medium">Agent Builder</span>
        </nav>
        <div className="rounded-card-lg border border-destructive/30 bg-destructive/5 p-6 flex flex-col items-center justify-center text-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" aria-hidden />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Failed to load agents</h2>
            <p className="text-sm text-muted-foreground mt-1">Something went wrong. Please try again.</p>
          </div>
          <Button onClick={() => refetchRegistries()} variant="outline" className="transition-transform duration-200 hover:scale-[1.02]">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up motion-reduce:animate-none">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-foreground font-medium">Agent Builder</span>
      </nav>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-card-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
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
              <option value="">Create new agent…</option>
              {registries.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {registries.length === 0 && (
        <div className="rounded-card-lg border border-dashed border-border bg-card-secondary/50 p-8 flex flex-col items-center justify-center text-center gap-4">
          <Bot className="h-14 w-14 text-muted-foreground" aria-hidden />
          <div>
            <p className="font-medium text-foreground">No agents yet</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create your first agent below to configure name, role, tone, memory scope, and assign skills from the registry.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Use the form in the next section to get started.</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <AgentCreationForm
          initialAgent={selectedAgent ?? null}
          allowedSkillIds={allowedSkillIds}
          onSelectSkills={openSkillPicker}
          onSubmit={handleAgentFormSubmit}
          onUpdate={handleAgentUpdate}
          onDelete={(id) => setDeleteConfirmId(id)}
          isLoading={createMutation.isPending}
          isUpdating={updateMutation.isPending}
          isDeleting={deleteMutation.isPending}
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

      <Dialog open={skillPickerOpen} onOpenChange={setSkillPickerOpen}>
        <DialogContent showClose={true}>
          <DialogHeader>
            <DialogTitle>Select skills from registry</DialogTitle>
            <DialogDescription>
              Choose which skills this agent is allowed to use. Changes apply when you confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2 max-h-64 overflow-y-auto">
            {skills.map((skill) => {
              const checked = skillPickerDraft.includes(skill.id)
              return (
                <label
                  key={skill.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border border-border bg-card-secondary/50 p-3 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-sm',
                    checked && 'ring-2 ring-primary/40 border-primary/50'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSkillInPicker(skill.id)}
                    className="h-4 w-4 rounded border-input focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label={`Select ${skill.name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    {skill.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillPickerOpen(false)} className="transition-transform duration-200 hover:scale-[1.02]">
              Cancel
            </Button>
            <Button onClick={confirmSkillPicker} className="transition-transform duration-200 hover:scale-[1.02]">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent showClose={true}>
          <DialogHeader>
            <DialogTitle>Delete agent</DialogTitle>
            <DialogDescription>
              This will permanently remove this agent. Memory and approval settings for this agent will be lost. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="transition-transform duration-200 hover:scale-[1.02]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteConfirmId && handleAgentDelete(deleteConfirmId)}
              className="transition-transform duration-200 hover:scale-[1.02]"
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
