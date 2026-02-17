import { useQuery } from '@tanstack/react-query'
import { personalCalendarTravelApi } from '@/api/personal-calendar-travel'

const QUERY_KEY = ['personal-calendar-travel'] as const

export function usePersonalCalendarTravel() {
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => personalCalendarTravelApi.list(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
