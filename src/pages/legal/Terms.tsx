import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="font-semibold text-foreground">Atlas</Link>
          <Link to="/">
            <Button variant="ghost" size="sm">Home</Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-12 prose prose-invert prose-headings:text-white prose-p:text-muted-foreground">
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p className="lead text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance</h2>
          <p>By using Atlas you agree to these terms. Self-hosted use is subject to the license under which you obtained the software.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Use</h2>
          <p>You are responsible for your use of the service and for ensuring compliance with applicable laws and third-party terms (e.g. GitHub, Google).</p>
        </section>
        <div className="mt-8">
          <Link to="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
