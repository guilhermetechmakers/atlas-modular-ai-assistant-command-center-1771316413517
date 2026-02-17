import { Link } from 'react-router-dom'
import { Bell, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface NotificationsAuditLogQuickLinkProps {
  className?: string
}

export function NotificationsAuditLogQuickLink({ className }: NotificationsAuditLogQuickLinkProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
        <Link to="/dashboard/audit" className="flex items-center gap-2">
          <Bell className="h-4 w-4" aria-hidden />
          <span>Notifications</span>
        </Link>
      </Button>
      <span className="text-muted-foreground" aria-hidden>·</span>
      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
        <Link to="/dashboard/audit" className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" aria-hidden />
          <span>Audit log</span>
        </Link>
      </Button>
    </div>
  )
}
