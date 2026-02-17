import { Calendar, ListTodo, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function PersonalPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Calendar & Travel</h1>
        <p className="mt-1 text-muted-foreground">Calendar, tasks, routines, and trip planning.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Calendar
            </CardTitle>
            <CardDescription>Day / week / month view. Sync with Google Calendar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-primary" />
              Tasks & routines
            </CardTitle>
            <CardDescription>Recurrence and reminders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Trip board
          </CardTitle>
          <CardDescription>Plan trip → AI itinerary → calendar events and packing list.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm">Plan trip</Button>
        </CardContent>
      </Card>
    </div>
  )
}
