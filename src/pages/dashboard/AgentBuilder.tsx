import { Bot, Plus, Settings2, Terminal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export function AgentBuilderPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Agent Builder & Skills Registry</h1>
          <p className="mt-1 text-muted-foreground">Create custom agents and manage skills.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New agent
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Agent creation
            </CardTitle>
            <CardDescription>Name, instructions, tone, and allowed skills.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Agent name</Label>
              <Input id="agent-name" placeholder="My Agent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <textarea
                id="instructions"
                className="flex min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Describe behavior and scope..."
              />
            </div>
            <Button variant="outline" size="sm">Select skills from registry</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Approval policy & memory
            </CardTitle>
            <CardDescription>Memory scope and human-in-the-loop settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill registry</CardTitle>
          <CardDescription>Allowlisted skills per agent; admin approval for third-party.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Test console
          </CardTitle>
          <CardDescription>Run simulated prompts and review logs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder="Enter test prompt..." className="font-mono text-sm" />
          <Button size="sm" className="mt-2">Run</Button>
        </CardContent>
      </Card>
    </div>
  )
}
