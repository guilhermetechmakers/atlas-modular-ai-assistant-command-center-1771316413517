import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Bot, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { AgentTone, MemoryScope } from '@/types/agent-builder-skills-registry'

const agentFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  role_instructions: z.string().min(1, 'Role/instructions are required'),
  tone: z.enum(['professional', 'friendly', 'concise', 'formal', 'casual']),
  memory_scope: z.enum(['session', 'conversation', 'persistent', 'none']),
})

export type AgentFormValues = z.infer<typeof agentFormSchema>

const TONE_OPTIONS: { value: AgentTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'concise', label: 'Concise' },
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
]

const MEMORY_SCOPE_OPTIONS: { value: MemoryScope; label: string }[] = [
  { value: 'session', label: 'Session only' },
  { value: 'conversation', label: 'Conversation' },
  { value: 'persistent', label: 'Persistent' },
  { value: 'none', label: 'None' },
]

export interface AgentCreationFormProps {
  defaultValues?: Partial<AgentFormValues>
  allowedSkillIds?: string[]
  onSelectSkills?: () => void
  onSubmit?: (values: AgentFormValues) => void
  isLoading?: boolean
}

export function AgentCreationForm({
  defaultValues,
  allowedSkillIds = [],
  onSelectSkills,
  onSubmit,
  isLoading = false,
}: AgentCreationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: '',
      role_instructions: '',
      tone: 'professional',
      memory_scope: 'conversation',
      ...defaultValues,
    },
  })

  const tone = watch('tone')
  const memory_scope = watch('memory_scope')

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Agent creation
          </CardTitle>
          <CardDescription>
            Name, role/instructions, tone, memory scope, and allowed skills.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={onSubmit ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="agent-name">Name</Label>
            <Input
              id="agent-name"
              placeholder="My Agent"
              {...register('name')}
              className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive animate-fade-in" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role-instructions">Role / instructions</Label>
            <Textarea
              id="role-instructions"
              placeholder="Describe behavior, scope, and constraints..."
              className={cn(
                'min-h-[100px]',
                errors.role_instructions && 'border-destructive focus-visible:ring-destructive'
              )}
              {...register('role_instructions')}
              aria-invalid={!!errors.role_instructions}
            />
            {errors.role_instructions && (
              <p className="text-sm text-destructive animate-fade-in" role="alert">
                {errors.role_instructions.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={tone === opt.value ? 'default' : 'outline'}
                  size="sm"
                  className="transition-transform duration-200 hover:scale-[1.02]"
                  onClick={() => setValue('tone', opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Memory scope</Label>
            <div className="flex flex-wrap gap-2">
              {MEMORY_SCOPE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={memory_scope === opt.value ? 'default' : 'outline'}
                  size="sm"
                  className="transition-transform duration-200 hover:scale-[1.02]"
                  onClick={() => setValue('memory_scope', opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Allowed skills</Label>
            <div className="flex flex-wrap items-center gap-2">
              {allowedSkillIds.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {allowedSkillIds.length} skill(s) selected
                </span>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="transition-transform duration-200 hover:scale-[1.02]"
                onClick={onSelectSkills}
              >
                <Plus className="mr-2 h-4 w-4" />
                Select skills from registry
              </Button>
            </div>
          </div>
          {onSubmit && (
            <Button type="submit" disabled={isLoading} className="mt-2">
              {isLoading ? 'Saving…' : 'Save agent'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
