import { Navigate, useLocation } from 'react-router-dom'

/**
 * Placeholder: in production, check real auth (e.g. Supabase session or JWT).
 * For now we allow access; replace with actual auth check and redirect to /login.
 */
function useAuth(): boolean {
  return true
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
