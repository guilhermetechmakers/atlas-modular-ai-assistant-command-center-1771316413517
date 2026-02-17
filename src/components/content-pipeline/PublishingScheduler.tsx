import { Calendar, Download, Link2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ScheduledItem, PlatformTag } from '@/types/content-pipeline'

const PLATFORM_LABELS: Record<PlatformTag, string> = {
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  blog: 'Blog',
  newsletter: 'Newsletter',
  instagram: 'Instagram',
}

export interface PublishingSchedulerProps {
  scheduled: ScheduledItem[]
  isLoading?: boolean
  onExportManual?: (item: ScheduledItem) => void
  onAddToGoogleCalendar?: (item: ScheduledItem) => void
}

export function PublishingScheduler({
  scheduled,
  isLoading = false,
  onExportManual,
  onAddToGoogleCalendar,
}: PublishingSchedulerProps) {
  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Publishing
          </CardTitle>
          <CardDescription>Link to scheduling connectors (MVP: manual export / Google Calendar).</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg mt-2" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Publishing scheduler
        </CardTitle>
        <CardDescription>
          Link to scheduling connectors. MVP: manual export or add to Google Calendar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {scheduled.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-10 text-center text-muted-foreground">
            <Link2 className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-2">No scheduled items.</p>
            <p className="text-sm">Schedule posts from the Content calendar, then export or add to Google Calendar here.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {scheduled.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-border p-4',
                  'transition-all duration-200 hover:border-primary/30 hover:shadow-sm'
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="secondary">{PLATFORM_LABELS[item.platform]}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.scheduledAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExportManual?.(item)}
                    className="transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddToGoogleCalendar?.(item)}
                    className="transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Google Calendar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
