import { useState } from 'react'
import { CalendarOff, Plus, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { TimeOffRequest, TimeOffStatus } from '@/types/personal-calendar-travel'

export interface TimeOffWorkflowProps {
  requests: TimeOffRequest[]
  isLoading?: boolean
  onCreateRequest?: (payload: { startDate: string; endDate: string; reason?: string }) => void
}

const STATUS_VARIANTS: Record<TimeOffStatus, 'secondary' | 'default' | 'outline'> = {
  draft: 'secondary',
  pending: 'default',
  approved: 'outline',
  rejected: 'outline',
}

export function TimeOffWorkflow({
  requests,
  isLoading = false,
  onCreateRequest,
}: TimeOffWorkflowProps) {
  const [showForm, setShowForm] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) return
    onCreateRequest?.({ startDate, endDate, reason: reason.trim() || undefined })
    setStartDate('')
    setEndDate('')
    setReason('')
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarOff className="h-5 w-5 text-primary" />
            Time off
          </CardTitle>
          <CardDescription>Create time-off requests (optional integration).</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CalendarOff className="h-5 w-5 text-primary" />
            Time off
          </CardTitle>
          <CardDescription>Create time-off requests (optional integration).</CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="transition-transform duration-200 hover:scale-[1.02]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New request
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-border bg-card-secondary/50 p-4 space-y-3 animate-fade-in"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="timeoff-start">Start date</Label>
                <Input
                  id="timeoff-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeoff-end">End date</Label>
                <Input
                  id="timeoff-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeoff-reason">Reason (optional)</Label>
              <Textarea
                id="timeoff-reason"
                placeholder="Vacation, sick leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                <Send className="mr-2 h-4 w-4" />
                Submit request
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {requests.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-6 text-center">
              <CalendarOff className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No time-off requests yet.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setShowForm(true)}
              >
                Create first request
              </Button>
            </div>
          ) : (
            requests
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card-secondary/50 px-3 py-2.5"
                >
                  <div>
                    <span className="font-medium">
                      {new Date(req.startDate).toLocaleDateString()} –{' '}
                      {new Date(req.endDate).toLocaleDateString()}
                    </span>
                    {req.reason && (
                      <p className="text-xs text-muted-foreground mt-0.5">{req.reason}</p>
                    )}
                  </div>
                  <Badge variant={STATUS_VARIANTS[req.status]} className="capitalize shrink-0">
                    {req.status}
                  </Badge>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
