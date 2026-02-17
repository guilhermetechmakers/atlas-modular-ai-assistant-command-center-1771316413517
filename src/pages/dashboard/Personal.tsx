import { useState, useCallback, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CalendarView,
  TaskListRoutines,
  TripBoard,
  TimeOffWorkflow,
  AIPersonalActions,
} from '@/components/personal-calendar-travel'
import { toast } from 'sonner'
import type {
  CalendarEvent,
  Task,
  TaskStatus,
  Trip,
  TripItineraryItem,
  TripBooking,
  PackingItem,
  TimeOffRequest,
} from '@/types/personal-calendar-travel'

function uuid() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function PersonalPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([])
  const [isLoading] = useState(false)

  const selectedTrip = selectedTripId ? trips.find((t) => t.id === selectedTripId) ?? null : null

  useEffect(() => {
    document.title = 'Calendar & Travel | Atlas'
    return () => {
      document.title = 'Atlas'
    }
  }, [])

  const handleAddTask = useCallback(
    (payload: { title: string; dueAt?: string; recurrence?: Task['recurrence'] }) => {
      const task: Task = {
        id: uuid(),
        title: payload.title,
        status: 'todo',
        dueAt: payload.dueAt,
        recurrence: payload.recurrence ?? 'none',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTasks((prev) => [task, ...prev])
      toast.success('Task added')
    },
    []
  )

  const handleToggleTask = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    )
    toast.success(status === 'done' ? 'Task completed' : 'Task reopened')
  }, [])

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    toast.success('Task removed')
  }, [])

  const handlePlanTrip = useCallback(() => {
    const start = new Date()
    const end = new Date()
    end.setDate(end.getDate() + 3)
    const trip: Trip = {
      id: uuid(),
      title: 'New trip',
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      itinerary: [],
      bookings: [],
      packingList: [],
      researchNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTrips((prev) => [trip, ...prev])
    setSelectedTripId(trip.id)
    toast.success('Trip created. Add itinerary, bookings, and packing list.')
  }, [])

  const handleWeeklyAgenda = useCallback(() => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const mockEvents: CalendarEvent[] = [
      {
        id: uuid(),
        title: 'Weekly review',
        start: new Date(weekStart).toISOString().slice(0, 19),
        end: new Date(weekStart.getTime() + 60 * 60 * 1000).toISOString().slice(0, 19),
        calendarId: 'local',
      },
    ]
    setEvents((prev) => [...mockEvents, ...prev])
    toast.success('Weekly agenda placeholder added. Connect Google Calendar for real events.')
  }, [])

  const handleAddItineraryItem = useCallback((item: Omit<TripItineraryItem, 'id'>) => {
    if (!selectedTripId) return
    const newItem: TripItineraryItem = { ...item, id: uuid() }
    setTrips((prev) =>
      prev.map((t) =>
        t.id === selectedTripId
          ? { ...t, itinerary: [...t.itinerary, newItem], updatedAt: new Date().toISOString() }
          : t
      )
    )
    toast.success('Itinerary item added')
  }, [selectedTripId])

  const handleAddBooking = useCallback(
    (booking: Omit<TripBooking, 'id'>) => {
      if (!selectedTripId) return
      const newBooking: TripBooking = { ...booking, id: uuid() }
      setTrips((prev) =>
        prev.map((t) =>
          t.id === selectedTripId
            ? { ...t, bookings: [...t.bookings, newBooking], updatedAt: new Date().toISOString() }
            : t
        )
      )
      toast.success('Booking added')
    },
    [selectedTripId]
  )

  const handleTogglePacking = useCallback(
    (itemId: string) => {
      if (!selectedTripId) return
      setTrips((prev) =>
        prev.map((t) =>
          t.id === selectedTripId
            ? {
                ...t,
                packingList: t.packingList.map((p) =>
                  p.id === itemId ? { ...p, packed: !p.packed } : p
                ),
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      )
    },
    [selectedTripId]
  )

  const handleAddPackingItem = useCallback(
    (label: string) => {
      if (!selectedTripId) return
      const item: PackingItem = { id: uuid(), label, packed: false }
      setTrips((prev) =>
        prev.map((t) =>
          t.id === selectedTripId
            ? { ...t, packingList: [...t.packingList, item], updatedAt: new Date().toISOString() }
            : t
        )
      )
      toast.success('Item added to packing list')
    },
    [selectedTripId]
  )

  const handleDeletePackingItem = useCallback(
    (itemId: string) => {
      if (!selectedTripId) return
      setTrips((prev) =>
        prev.map((t) =>
          t.id === selectedTripId
            ? {
                ...t,
                packingList: t.packingList.filter((p) => p.id !== itemId),
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      )
      toast.success('Item removed')
    },
    [selectedTripId]
  )

  const handleUpdateResearchNotes = useCallback(
    (notes: string) => {
      if (!selectedTripId) return
      setTrips((prev) =>
        prev.map((t) =>
          t.id === selectedTripId ? { ...t, researchNotes: notes, updatedAt: new Date().toISOString() } : t
        )
      )
    },
    [selectedTripId]
  )

  const handleCreateTimeOffRequest = useCallback(
    (payload: { startDate: string; endDate: string; reason?: string }) => {
      const req: TimeOffRequest = {
        id: uuid(),
        startDate: payload.startDate,
        endDate: payload.endDate,
        reason: payload.reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTimeOffRequests((prev) => [req, ...prev])
      toast.success('Time-off request submitted')
    },
    []
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Calendar & Travel
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage calendar, tasks, routines, travel boards, and time-off. Connect Google Calendar for events.
          </p>
        </div>
      </div>

      <AIPersonalActions onPlanTrip={handlePlanTrip} onWeeklyAgenda={handleWeeklyAgenda} />

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-card-secondary border border-border">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="tasks">Tasks & routines</TabsTrigger>
          <TabsTrigger value="trip">Trip board</TabsTrigger>
          <TabsTrigger value="timeoff">Time off</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView events={events} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <TaskListRoutines
            tasks={tasks}
            isLoading={isLoading}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </TabsContent>

        <TabsContent value="trip" className="mt-6 space-y-4">
          {trips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {trips.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTripId(t.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                    selectedTripId === t.id
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          )}
          <TripBoard
            trip={selectedTrip}
            isLoading={isLoading}
            onAddItineraryItem={handleAddItineraryItem}
            onAddBooking={handleAddBooking}
            onTogglePacking={handleTogglePacking}
            onAddPackingItem={handleAddPackingItem}
            onDeletePackingItem={handleDeletePackingItem}
            onUpdateResearchNotes={handleUpdateResearchNotes}
          />
        </TabsContent>

        <TabsContent value="timeoff" className="mt-6">
          <TimeOffWorkflow
            requests={timeOffRequests}
            isLoading={isLoading}
            onCreateRequest={handleCreateTimeOffRequest}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
