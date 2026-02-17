import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Calendar, FolderGit2, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
const features = [
  {
    icon: FolderGit2,
    title: 'GitHub-first projects',
    description: 'Repo explorer, issues, roadmaps, and AI PM actions in one place.',
  },
  {
    icon: Sparkles,
    title: 'Domain AI agents',
    description: 'PM, Personal, Social, Research, and Finance agents with memory and skills.',
  },
  {
    icon: Calendar,
    title: 'Calendar & travel',
    description: 'Tasks, routines, trip planning, and calendar sync with approvals.',
  },
  {
    icon: Shield,
    title: 'Self-host & audit',
    description: 'Human-in-the-loop, append-only audit logs, and full control.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient hero background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-transparent animate-gradient bg-[length:200%_200%]" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full bg-gradient-to-tl from-atlas-cyan/10 via-transparent to-transparent animate-gradient bg-[length:200%_200%]" style={{ animationDelay: '2s' }} />
      </div>

      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">A</span>
            Atlas
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative px-4 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-hero-lg font-bold tracking-tight text-white animate-fade-in-up md:text-6xl">
              Your unified{' '}
              <span className="bg-gradient-to-r from-primary to-atlas-cyan bg-clip-text text-transparent">
                command center
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              Projects, content, research, calendar, and finance in one searchable workspace—powered by modular AI agents you control.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup">
                <Button size="lg" className="min-h-12 px-8 text-base">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="min-h-12 px-8 text-base">
                  Self-host Guide
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-4 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-white md:text-3xl">Built for solo builders and small teams</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              One system of record. Domain agents. Approval flows and audit trails.
            </p>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }, i) => (
                <div
                  key={title}
                  className="rounded-card-lg border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/30 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * i}s` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-4 py-20 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Bot className="mx-auto h-16 w-16 text-primary" aria-hidden />
            <h2 className="mt-6 text-2xl font-bold text-white md:text-3xl">Extensible Agent Builder</h2>
            <p className="mt-3 text-muted-foreground">
              Create custom agents, allowlist skills, set approval policies, and test in the console.
            </p>
            <div className="mt-8">
              <Link to="/signup">
                <Button size="lg">Start building</Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-border px-4 py-12 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm text-muted-foreground">© Atlas. Self-hostable command center.</span>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
