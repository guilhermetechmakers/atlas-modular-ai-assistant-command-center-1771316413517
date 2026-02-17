import { LayoutDashboard } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'

export interface CreateWorkspaceFlowProps {
  /** For use inside a parent form (react-hook-form). */
  register: UseFormRegister<{ workspaceName: string }>
  errors?: FieldErrors<{ workspaceName?: string }>
  className?: string
}

export function CreateWorkspaceFlow({ register, errors, className }: CreateWorkspaceFlowProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label htmlFor="workspace-name">Workspace name</Label>
        <div className="relative">
          <LayoutDashboard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            id="workspace-name"
            type="text"
            autoComplete="organization"
            placeholder="My Workspace"
            className={cn('pl-9 transition-colors duration-200', errors?.workspaceName && 'border-destructive focus-visible:ring-destructive')}
            {...register('workspaceName')}
          />
        </div>
        {errors?.workspaceName?.message && (
          <p className="text-sm text-destructive animate-fade-in" role="alert">
            {String(errors.workspaceName.message)}
          </p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Create a workspace for first-time signup. You can change this later in settings.
      </p>
    </div>
  )
}
