import { Settings2, UserCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ApprovalPolicy } from '@/types/agent-builder-skills-registry'

export interface ApprovalPolicySettingsProps {
  policy: ApprovalPolicy | null
  isLoading?: boolean
  onToggleHumanInLoop?: (enabled: boolean) => void
  onRateLimitChange?: (field: 'per_minute' | 'per_day', value: number) => void
  disabled?: boolean
}

export function ApprovalPolicySettings({
  policy,
  isLoading = false,
  onToggleHumanInLoop,
  onRateLimitChange,
  disabled = false,
}: ApprovalPolicySettingsProps) {
  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Approval policy
          </CardTitle>
          <CardDescription>Human-in-the-loop toggles and rate limits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </CardContent>
      </Card>
    )
  }

  const humanInLoop = policy?.human_in_loop ?? false
  const perMinute = policy?.rate_limit_requests_per_minute ?? 10
  const perDay = policy?.rate_limit_requests_per_day ?? 500

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          Approval policy
        </CardTitle>
        <CardDescription>Human-in-the-loop toggles and rate limits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <UserCheck className="h-5 w-5 text-primary shrink-0" aria-hidden />
            <div>
              <Label htmlFor="human-in-loop" className="text-base font-medium">
                Human-in-the-loop
              </Label>
              <p className="text-sm text-muted-foreground">
                Require approval before executing sensitive actions
              </p>
            </div>
          </div>
          <Switch
            id="human-in-loop"
            checked={humanInLoop}
            disabled={disabled}
            onCheckedChange={onToggleHumanInLoop}
            aria-label="Enable human-in-the-loop"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base">Rate limits</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rate-limit-minute" className="text-sm text-muted-foreground">
                Requests per minute
              </Label>
              <Input
                id="rate-limit-minute"
                type="number"
                min={1}
                max={120}
                value={perMinute}
                disabled={disabled}
                onChange={(e) =>
                  onRateLimitChange?.('per_minute', Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className={cn('transition-colors duration-200')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate-limit-day" className="text-sm text-muted-foreground">
                Requests per day
              </Label>
              <Input
                id="rate-limit-day"
                type="number"
                min={1}
                max={10000}
                value={perDay}
                disabled={disabled}
                onChange={(e) =>
                  onRateLimitChange?.('per_day', Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className={cn('transition-colors duration-200')}
              />
            </div>
          </div>
        </div>

        {policy?.require_approval_for_skills && policy.require_approval_for_skills.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Skills requiring approval
            </Label>
            <p className="text-sm text-foreground">
              {policy.require_approval_for_skills.length} skill(s) configured for approval
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
