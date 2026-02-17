import { useState } from 'react'
import { Calendar, CalendarDays, Tag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { CalendarPost, PlatformTag } from '@/types/content-pipeline'

const PLATFORM_LABELS: Record<PlatformTag, string> = {
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  blog: 'Blog',
  newsletter: 'Newsletter',
  instagram: 'Instagram',
}

export interface ContentCalendarProps {
  posts: CalendarPost[]
  isLoading?: boolean
  onSchedule?: (draftId: string, date: string, platform: PlatformTag) => void
  onDragDrop?: (postId: string, newDate: string) => void
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const days = last.getDate()
  return { startPad, days }
}

export function ContentCalendar({
  posts,
  isLoading = false,
  onDragDrop,
}: ContentCalendarProps) {
  const [viewDate, setViewDate] = useState(() => new Date())
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const { startPad, days } = getDaysInMonth(year, month)

  const goPrev = () => setViewDate(new Date(year, month - 1))
  const goNext = () => setViewDate(new Date(year, month + 1))

  const dateKey = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const postsByDate: Record<string, CalendarPost[]> = {}
  posts.forEach((p) => {
    const key = p.scheduledDate.slice(0, 10)
    if (!postsByDate[key]) postsByDate[key] = []
    postsByDate[key].push(p)
  })

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Content calendar
          </CardTitle>
          <CardDescription>Drag to schedule posts with platform tags.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Content calendar
          </CardTitle>
          <CardDescription>Drag to schedule posts with platform tags.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goPrev} aria-label="Previous month">
            ←
          </Button>
          <span className="min-w-[140px] text-center text-sm font-medium">
            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" size="icon" onClick={goNext} aria-label="Next month">
            →
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-card-secondary">
            {DAYS.map((day) => (
              <div
                key={day}
                className="border-r border-border py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr min-h-[320px]">
            {Array.from({ length: startPad }, (_, i) => (
              <div key={`pad-${i}`} className="border-b border-r border-border bg-muted/20 min-h-[60px]" />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1
              const key = dateKey(d)
              const dayPosts = postsByDate[key] ?? []
              return (
                <div
                  key={key}
                  className={cn(
                    'min-h-[60px] border-b border-r border-border p-1 last:border-r-0',
                    'flex flex-col gap-1 transition-colors hover:bg-card-secondary/50'
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const postId = e.dataTransfer.getData('postId')
                    if (postId) onDragDrop?.(postId, key)
                  }}
                >
                  <span className="text-xs text-muted-foreground">{d}</span>
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('postId', post.id)
                        e.dataTransfer.setData('date', key)
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        const postId = e.dataTransfer.getData('postId')
                        if (postId && postId !== post.id) onDragDrop?.(postId, key)
                      }}
                      className={cn(
                        'rounded border border-primary/30 bg-primary/10 px-2 py-1 text-xs cursor-grab active:cursor-grabbing',
                        'transition-all duration-200 hover:shadow-sm hover:border-primary/50'
                      )}
                    >
                      <span className="font-medium truncate block">{post.title}</span>
                      <Badge variant="secondary" className="mt-0.5 text-[10px]">
                        <Tag className="h-2.5 w-2.5 mr-0.5" />
                        {PLATFORM_LABELS[post.platform]}
                      </Badge>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
        {posts.length === 0 && (
          <div className="mt-4 rounded-lg border border-dashed border-border py-6 text-center text-muted-foreground">
            <Calendar className="mx-auto h-10 w-10 opacity-50" />
            <p className="mt-2 text-sm">No scheduled posts.</p>
            <p className="text-xs">Schedule drafts from the Drafts tab to see them here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
