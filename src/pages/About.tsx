import { Link } from 'react-router-dom'
import { BookOpen, MessageCircle, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="font-semibold text-foreground">Atlas</Link>
          <nav className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Docs & Help</h1>
        <p className="mt-2 text-muted-foreground">Onboarding, docs, and support.</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Documentation
              </CardTitle>
              <CardDescription>Searchable docs and FAQ.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search docs..." className="mb-3" />
              <Button variant="outline" size="sm">Browse FAQ</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                Self-host guide
              </CardTitle>
              <CardDescription>Docker and deployment.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Deploy with Docker Compose. Configure env vars, Postgres, and optional Redis.
              </p>
              <Button variant="outline" size="sm">View guide</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Contact
            </CardTitle>
            <CardDescription>Changelog and contact form.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="flex min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="Your question or feedback..."
              />
            </div>
            <Button size="sm">Send</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
