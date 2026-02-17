import { api } from '@/lib/api'
import type { PersonalCalendarTravel } from '@/types/personal-calendar-travel'

const BASE = '/personal-calendar-travel'

export const personalCalendarTravelApi = {
  list: () => api.get<PersonalCalendarTravel[]>(BASE),
  get: (id: string) => api.get<PersonalCalendarTravel>(`${BASE}/${id}`),
  create: (data: Pick<PersonalCalendarTravel, 'title' | 'description' | 'status'>) =>
    api.post<PersonalCalendarTravel>(BASE, data),
  update: (
    id: string,
    data: Partial<Pick<PersonalCalendarTravel, 'title' | 'description' | 'status'>>
  ) => api.patch<PersonalCalendarTravel>(`${BASE}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),
}
