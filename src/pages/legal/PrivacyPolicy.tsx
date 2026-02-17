import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="lead text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Data we collect</h2>
          <p>Atlas is designed for self-hosting. When self-hosted, your data stays in your infrastructure. We do not collect personal data unless you use a hosted offering.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">2. How we use data</h2>
          <p>Workspace data (repos, notes, calendar, transactions) is used only to provide the service. Encrypted tokens for integrations are stored per your configuration.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Your rights</h2>
          <p>You can export your workspace data and request deletion. For self-hosted instances, you control retention and backups.</p>
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
