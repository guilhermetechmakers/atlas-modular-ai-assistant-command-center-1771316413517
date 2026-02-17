import { Shield } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export interface SSOAndMFACTAProps {
  /** Two-factor enabled state. Disabled by default per spec. */
  twoFactorEnabled?: boolean
  onTwoFactorChange?: (enabled: boolean) => void
  /** When true, the toggle is disabled (e.g. not yet implemented). */
  twoFactorDisabled?: boolean
  className?: string
}

export function SSOAndMFACTA({
  twoFactorEnabled = false,
  onTwoFactorChange,
  twoFactorDisabled = true,
  className,
}: SSOAndMFACTAProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3 transition-shadow duration-200 hover:shadow-card',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Shield className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <Label htmlFor="mfa-toggle" className="text-sm font-medium text-foreground cursor-default">
            Enable two-factor authentication
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add an extra layer of security (optional)
          </p>
        </div>
      </div>
      <Switch
        id="mfa-toggle"
        checked={twoFactorEnabled}
        onCheckedChange={onTwoFactorChange}
        disabled={twoFactorDisabled}
        aria-label="Enable two-factor authentication"
      />
    </div>
  )
}
