import { Sparkles, MapPin, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface AIPersonalActionsProps {
  onPlanTrip?: () => void
  onWeeklyAgenda?: () => void
}

export function AIPersonalActions({ onPlanTrip, onWeeklyAgenda }: AIPersonalActionsProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Personal Actions
        </CardTitle>
        <CardDescription>
          Quick actions powered by AI. Plan a trip or get your weekly agenda.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button
          onClick={onPlanTrip}
          className="transition-transform duration-200 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80 shadow-glow"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Plan trip
        </Button>
        <Button
          variant="secondary"
          onClick={onWeeklyAgenda}
          className="transition-transform duration-200 hover:scale-[1.02]"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          Weekly agenda
        </Button>
      </CardContent>
    </Card>
  )
}
