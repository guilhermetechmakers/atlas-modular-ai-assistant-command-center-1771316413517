import { useState, useMemo } from 'react'
import { Calendar, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { CalendarEvent, CalendarViewMode } from '@/types/personal-calendar-travel'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export interface CalendarViewProps {
  events: CalendarEvent[]
  isLoading?: boolean
}

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const days = last.getDate()
  return { startPad, days }
}

function dateKey(year: number, month: number, d: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function eventsForDate(events: CalendarEvent[], dateStr: string): CalendarEvent[] {
  return events.filter((e) => {
    const start = e.start.slice(0, 10)
    const end = e.end?.slice(0, 10) ?? start
    return dateStr >= start && dateStr <= end
  })
}

function getWeekDates(anchor: Date): string[] {
  const d = new Date(anchor)
  const day = d.getDay()
  const start = new Date(d)
  start.setDate(d.getDate() - day)
  const out: string[] = []
  for (let i = 0; i < 7; i++) {
    const x = new Date(start)
    x.setDate(start.getDate() + i)
    out.push(x.toISOString().slice(0, 10))
  }
  return out
}

export function CalendarView({ events, isLoading = false }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(() => new Date())
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const { startPad, days } = getDaysInMonth(year, month)

  const goPrev = () => {
    const d = new Date(viewDate)
    if (viewMode === 'month') d.setMonth(month - 1)
    else d.setDate(d.getDate() - (viewMode === 'week' ? 7 : 1))
    setViewDate(d)
  }
  const goNext = () => {
    const d = new Date(viewDate)
    if (viewMode === 'month') d.setMonth(month + 1)
    else d.setDate(d.getDate() + (viewMode === 'week' ? 7 : 1))
    setViewDate(d)
  }

  const weekDates = useMemo(() => getWeekDates(viewDate), [viewDate])
  const dayStart = viewDate.toISOString().slice(0, 10)

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Calendar
          </CardTitle>
          <CardDescription>Day / week / month with events from connected calendars.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Calendar
          </CardTitle>
          <CardDescription>Day / week / month with events from connected calendars.</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border bg-card-secondary p-1">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'secondary' : 'ghost'}
                size="sm"
                className="capitalize"
                onClick={() => setViewMode(mode)}
              >
                {mode}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={goPrev} aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="min-w-[160px] text-center text-sm font-medium">
              {viewMode === 'month'
                ? viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                : viewMode === 'week'
                  ? `Week of ${new Date(weekDates[0]).toLocaleDateString()}`
                  : viewDate.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
            </span>
            <Button variant="outline" size="icon" onClick={goNext} aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'month' && (
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border bg-card-secondary">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr min-h-[320px]">
              {Array.from({ length: startPad }, (_, i) => (
                <div key={`pad-${i}`} className="min-h-[60px] border-b border-r border-border bg-muted/20 p-1" />
              ))}
              {Array.from({ length: days }, (_, i) => {
                const d = i + 1
                const key = dateKey(year, month, d)
                const dayEvents = eventsForDate(events, key)
                const isToday =
                  key === new Date().toISOString().slice(0, 10)
                return (
                  <div
                    key={key}
                    className={cn(
                      'min-h-[60px] border-b border-r border-border p-1 flex flex-col transition-colors hover:bg-card-secondary/50',
                      isToday && 'bg-primary/10'
                    )}
                  >
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isToday ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {d}
                    </span>
                    <div className="flex-1 overflow-hidden mt-0.5 space-y-0.5">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          className="truncate rounded px-1 py-0.5 text-xs bg-primary/20 text-primary-foreground"
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="rounded-lg border border-border divide-y divide-border">
            {weekDates.map((dateStr) => {
              const dayEvents = eventsForDate(events, dateStr)
              const isToday = dateStr === new Date().toISOString().slice(0, 10)
              return (
                <div
                  key={dateStr}
                  className={cn('p-3', isToday && 'bg-primary/5')}
                >
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {new Date(dateStr).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="space-y-1.5">
                    {dayEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No events</p>
                    ) : (
                      dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex items-center gap-2 rounded-lg border border-border bg-card-secondary/50 px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{ev.title}</span>
                          {!ev.allDay && (
                            <span className="text-muted-foreground text-xs">
                              {ev.start.slice(11, 16)} – {ev.end?.slice(11, 16)}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {viewMode === 'day' && (
          <div className="rounded-lg border border-border p-4">
            <div className="space-y-2">
              {eventsForDate(events, dayStart).length === 0 ? (
                <p className="text-sm text-muted-foreground">No events this day.</p>
              ) : (
                eventsForDate(events, dayStart)
                  .sort((a, b) => (a.start < b.start ? -1 : 1))
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-lg border border-border bg-card-secondary/50 p-4 transition-all duration-200 hover:shadow-card"
                    >
                      <div className="font-medium">{ev.title}</div>
                      {ev.description && (
                        <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                        {!ev.allDay && (
                          <span>
                            {ev.start.slice(11, 16)} – {ev.end?.slice(11, 16)}
                          </span>
                        )}
                        {ev.location && <span>{ev.location}</span>}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
