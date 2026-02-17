import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center animate-fade-in-up">
        <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground" aria-hidden />
        <h1 className="mt-6 text-3xl font-bold text-white">404</h1>
        <p className="mt-2 text-muted-foreground">This page doesn't exist.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/">
            <Button>Go to home</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">Help</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
