import { Link } from 'react-router-dom'
import { Plus, StickyNote, Bot, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const actions = [
  { label: 'Create issue', icon: Plus, to: '/dashboard/projects', description: 'New GitHub issue' },
  { label: 'New note', icon: StickyNote, to: '/dashboard/research', description: 'Add note' },
  { label: 'Create agent', icon: Bot, to: '/dashboard/agents', description: 'New agent' },
  { label: 'Import CSV', icon: Upload, to: '/dashboard/finance', description: 'Import transactions' },
] as const

export interface QuickActionsToolbarProps {
  className?: string
}

export function QuickActionsToolbar({ className }: QuickActionsToolbarProps) {
  return (
    <div className={cn('rounded-card-lg border border-border bg-card p-4', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map(({ label, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Button
              variant="secondary"
              size="sm"
              className="min-h-[44px] min-w-[44px] transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
