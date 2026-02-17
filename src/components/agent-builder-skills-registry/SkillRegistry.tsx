import { Puzzle, Shield, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Skill, SkillPermissionLevel } from '@/types/agent-builder-skills-registry'

const PERM_LABELS: Record<SkillPermissionLevel, string> = {
  read: 'Read',
  write: 'Write',
  admin: 'Admin',
}

export interface SkillRegistryProps {
  skills: Skill[]
  isLoading?: boolean
  selectedSkillIds?: string[]
  onToggleSkill?: (skillId: string) => void
  onInstall?: (skillId: string) => void
  emptyMessage?: string
}

export function SkillRegistry({
  skills,
  isLoading = false,
  selectedSkillIds = [],
  onToggleSkill,
  onInstall,
  emptyMessage = 'No skills in the registry. Install skills to assign to agents.',
}: SkillRegistryProps) {
  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-primary" />
            Skill registry
          </CardTitle>
          <CardDescription>
            List of available skills with descriptions and permission level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Puzzle className="h-5 w-5 text-primary" />
          Skill registry
        </CardTitle>
        <CardDescription>
          List of available skills with descriptions and permission level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card-secondary/50 py-12 px-4 text-center">
            <Puzzle className="h-12 w-12 text-muted-foreground mb-3" aria-hidden />
            <p className="text-sm text-muted-foreground max-w-sm">{emptyMessage}</p>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {skills.map((skill) => {
              const isSelected = selectedSkillIds.includes(skill.id)
              return (
                <li
                  key={skill.id}
                  className={cn(
                    'rounded-lg border border-border bg-card-secondary/50 p-4 transition-all duration-200',
                    'hover:shadow-md hover:border-primary/30',
                    isSelected && 'ring-2 ring-primary/40 border-primary/50'
                  )}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{skill.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {PERM_LABELS[skill.permission_level]}
                        </Badge>
                        {skill.installed && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600/50">
                            <Check className="h-3 w-3 mr-0.5" />
                            Installed
                          </Badge>
                        )}
                      </div>
                      {skill.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{skill.description}</p>
                      )}
                      {skill.category && (
                        <p className="mt-1 text-xs text-muted-foreground">Category: {skill.category}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {onToggleSkill && (
                        <Button
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          className="transition-transform duration-200 hover:scale-[1.02]"
                          onClick={() => onToggleSkill(skill.id)}
                          aria-pressed={isSelected}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </Button>
                      )}
                      {onInstall && !skill.installed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="transition-transform duration-200 hover:scale-[1.02]"
                          onClick={() => onInstall(skill.id)}
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Install
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
