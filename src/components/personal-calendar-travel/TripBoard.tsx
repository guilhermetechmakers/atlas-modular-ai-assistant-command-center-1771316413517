import { useState } from 'react'
import {
  MapPin,
  Plus,
  Plane,
  Hotel,
  Car,
  Calendar,
  Luggage,
  FileText,
  Trash2,
  Check,
  Circle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type {
  Trip,
  TripItineraryItem,
  TripBooking,
  PackingItem,
} from '@/types/personal-calendar-travel'

export interface TripBoardProps {
  trip: Trip | null
  isLoading?: boolean
  onSaveTrip?: (trip: Partial<Trip> & { id?: string }) => void
  onAddItineraryItem?: (item: Omit<TripItineraryItem, 'id'>) => void
  onAddBooking?: (booking: Omit<TripBooking, 'id'>) => void
  onTogglePacking?: (itemId: string) => void
  onAddPackingItem?: (label: string) => void
  onDeletePackingItem?: (itemId: string) => void
  onUpdateResearchNotes?: (notes: string) => void
}

const BOOKING_ICONS: Record<TripBooking['type'], React.ComponentType<{ className?: string }>> = {
  flight: Plane,
  hotel: Hotel,
  car: Car,
  activity: Calendar,
  other: FileText,
}

export function TripBoard({
  trip,
  isLoading = false,
  onAddItineraryItem,
  onAddBooking,
  onTogglePacking,
  onAddPackingItem,
  onDeletePackingItem,
  onUpdateResearchNotes,
}: TripBoardProps) {
  const [newItineraryTitle, setNewItineraryTitle] = useState('')
  const [newItineraryDate, setNewItineraryDate] = useState('')
  const [newItineraryTime, setNewItineraryTime] = useState('')
  const [newBookingType, setNewBookingType] = useState<TripBooking['type']>('other')
  const [newBookingName, setNewBookingName] = useState('')
  const [newBookingConfirmation, setNewBookingConfirmation] = useState('')
  const [newPackingLabel, setNewPackingLabel] = useState('')

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Trip board
          </CardTitle>
          <CardDescription>Itinerary, bookings, packing list, and research notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!trip) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Trip board
          </CardTitle>
          <CardDescription>Itinerary, bookings, packing list, and research notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border py-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">No trip selected</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use &quot;Plan trip&quot; in AI Personal Actions to create a trip, or select one from your list.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleAddItinerary = (e: React.FormEvent) => {
    e.preventDefault()
    const date = newItineraryDate || new Date().toISOString().slice(0, 10)
    if (!newItineraryTitle.trim()) return
    onAddItineraryItem?.({ date, title: newItineraryTitle.trim(), time: newItineraryTime || undefined })
    setNewItineraryTitle('')
    setNewItineraryDate('')
    setNewItineraryTime('')
  }

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBookingName.trim()) return
    onAddBooking?.({
      type: newBookingType,
      name: newBookingName.trim(),
      confirmationCode: newBookingConfirmation.trim() || undefined,
    })
    setNewBookingName('')
    setNewBookingConfirmation('')
  }

  const handleAddPacking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPackingLabel.trim()) return
    onAddPackingItem?.(newPackingLabel.trim())
    setNewPackingLabel('')
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {trip.title}
        </CardTitle>
        <CardDescription>
          {trip.destination && `${trip.destination} · `}
          {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-card-secondary border border-border">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="packing">Packing</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="mt-4 space-y-4">
            <form onSubmit={handleAddItinerary} className="flex flex-wrap gap-2">
              <Input
                placeholder="Activity or place"
                value={newItineraryTitle}
                onChange={(e) => setNewItineraryTitle(e.target.value)}
                className="max-w-[200px]"
              />
              <Input
                type="date"
                value={newItineraryDate}
                onChange={(e) => setNewItineraryDate(e.target.value)}
                className="w-[140px]"
              />
              <Input
                placeholder="Time (optional)"
                value={newItineraryTime}
                onChange={(e) => setNewItineraryTime(e.target.value)}
                className="w-[100px]"
              />
              <Button type="submit" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </form>
            <div className="space-y-2">
              {trip.itinerary.length === 0 ? (
                <p className="text-sm text-muted-foreground">No itinerary items yet.</p>
              ) : (
                trip.itinerary
                  .sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? ''))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card-secondary/50 px-3 py-2"
                    >
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{item.title}</span>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                          {item.time && ` · ${item.time}`}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4 space-y-4">
            <form onSubmit={handleAddBooking} className="flex flex-wrap gap-2 items-end">
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <select
                  className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={newBookingType}
                  onChange={(e) => setNewBookingType(e.target.value as TripBooking['type'])}
                >
                  <option value="flight">Flight</option>
                  <option value="hotel">Hotel</option>
                  <option value="car">Car</option>
                  <option value="activity">Activity</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input
                placeholder="Name / reference"
                value={newBookingName}
                onChange={(e) => setNewBookingName(e.target.value)}
                className="max-w-[180px]"
              />
              <Input
                placeholder="Confirmation #"
                value={newBookingConfirmation}
                onChange={(e) => setNewBookingConfirmation(e.target.value)}
                className="w-[140px]"
              />
              <Button type="submit" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </form>
            <div className="space-y-2">
              {trip.bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bookings yet.</p>
              ) : (
                trip.bookings.map((b) => {
                  const Icon = BOOKING_ICONS[b.type]
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card-secondary/50 px-3 py-2"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{b.name}</span>
                        {b.confirmationCode && (
                          <span className="text-xs text-muted-foreground ml-2">
                            #{b.confirmationCode}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="packing" className="mt-4 space-y-4">
            <form onSubmit={handleAddPacking} className="flex gap-2">
              <Input
                placeholder="Add item..."
                value={newPackingLabel}
                onChange={(e) => setNewPackingLabel(e.target.value)}
                className="max-w-[240px]"
              />
              <Button type="submit" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </form>
            <div className="space-y-1.5">
              {trip.packingList.length === 0 ? (
                <p className="text-sm text-muted-foreground">Packing list is empty.</p>
              ) : (
                trip.packingList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card-secondary/50 px-3 py-2 group"
                  >
                    <button
                      type="button"
                      onClick={() => onTogglePacking?.(item.id)}
                      className="rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={item.packed ? `Mark ${item.label} unpacked` : `Mark ${item.label} packed`}
                    >
                      {item.packed ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    <span
                      className={cn(
                        'flex-1',
                        item.packed && 'text-muted-foreground line-through'
                      )}
                    >
                      {item.label}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeletePackingItem?.(item.id)}
                      aria-label={`Remove ${item.label}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-4">
            <div className="space-y-2">
              <Label>Research notes</Label>
              <Textarea
                placeholder="Links, tips, places to try..."
                value={trip.researchNotes}
                onChange={(e) => onUpdateResearchNotes?.(e.target.value)}
                className="min-h-[120px] resize-y"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
