import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Error500Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center animate-fade-in-up">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive" aria-hidden />
        <h1 className="mt-6 text-3xl font-bold text-white">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">We've been notified. Please try again.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">Report issue</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
