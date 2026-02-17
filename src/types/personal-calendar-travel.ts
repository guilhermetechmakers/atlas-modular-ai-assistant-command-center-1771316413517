/**
 * Personal Calendar & Travel types for calendar, tasks, trips, and time-off.
 */

/** DB row for personal calendar/travel (RLS by user_id). */
export interface PersonalCalendarTravel {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export type CalendarViewMode = 'day' | 'week' | 'month'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  allDay?: boolean
  calendarId?: string
  color?: string
  description?: string
  location?: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type RecurrenceRule = 'daily' | 'weekly' | 'monthly' | 'none'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  dueAt?: string
  recurrence?: RecurrenceRule
  createdAt: string
  updatedAt: string
}

export interface Trip {
  id: string
  title: string
  startDate: string
  endDate: string
  destination?: string
  itinerary: TripItineraryItem[]
  bookings: TripBooking[]
  packingList: PackingItem[]
  researchNotes: string
  createdAt: string
  updatedAt: string
}

export interface TripItineraryItem {
  id: string
  date: string
  title: string
  notes?: string
  time?: string
}

export interface TripBooking {
  id: string
  type: 'flight' | 'hotel' | 'car' | 'activity' | 'other'
  name: string
  confirmationCode?: string
  date?: string
  notes?: string
}

export interface PackingItem {
  id: string
  label: string
  packed: boolean
}

export type TimeOffStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface TimeOffRequest {
  id: string
  startDate: string
  endDate: string
  reason?: string
  status: TimeOffStatus
  createdAt: string
  updatedAt: string
}
