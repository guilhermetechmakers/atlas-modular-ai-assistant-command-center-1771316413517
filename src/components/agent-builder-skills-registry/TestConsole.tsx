import { useState, useRef, useEffect } from 'react'
import { Terminal, Play, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { TestConsoleLog } from '@/types/agent-builder-skills-registry'

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return iso
  }
}

export interface TestConsoleProps {
  agentId: string | null
  logs: TestConsoleLog[]
  onRun?: (prompt: string) => void
  onClearLogs?: () => void
  isRunning?: boolean
  disabled?: boolean
}

export function TestConsole({
  agentId,
  logs,
  onRun,
  onClearLogs,
  isRunning = false,
  disabled = false,
}: TestConsoleProps) {
  const [prompt, setPrompt] = useState('')
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = prompt.trim()
    if (trimmed && onRun) {
      onRun(trimmed)
      setPrompt('')
    }
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Test console
          </CardTitle>
          <CardDescription>
            Run simulated prompts against the agent and review logs.
          </CardDescription>
        </div>
        {logs.length > 0 && onClearLogs && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground transition-transform duration-200 hover:scale-[1.02]"
            onClick={onClearLogs}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear logs
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Enter test prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={disabled || !agentId || isRunning}
            className="font-mono text-sm flex-1"
            aria-label="Test prompt"
          />
          <Button
            type="submit"
            size="sm"
            disabled={disabled || !agentId || !prompt.trim() || isRunning}
            className="transition-transform duration-200 hover:scale-[1.02] shrink-0"
          >
            {isRunning ? (
              'Running…'
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run
              </>
            )}
          </Button>
        </form>

        {!agentId ? (
          <div className="rounded-lg border border-dashed border-border bg-card-secondary/50 py-8 px-4 text-center flex flex-col items-center gap-2">
            <Terminal className="h-10 w-10 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">Select an agent to run test prompts.</p>
            <p className="text-xs text-muted-foreground">Choose an agent above, then enter a prompt and run to see logs here.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card-secondary overflow-hidden">
            <div className="max-h-64 overflow-y-auto p-2 space-y-2 font-mono text-sm">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-2">
                  <Terminal className="h-10 w-10 text-muted-foreground" aria-hidden />
                  <p className="text-sm text-muted-foreground">No logs yet.</p>
                  <p className="text-xs text-muted-foreground">Enter a prompt above and click Run to test the agent.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      'rounded-md p-3 border border-border/50',
                      log.status === 'error'
                        ? 'bg-destructive/10 border-destructive/30'
                        : 'bg-background/50'
                    )}
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span>{formatTime(log.timestamp)}</span>
                      <span
                        className={cn(
                          log.status === 'error' ? 'text-destructive' : 'text-green-600 dark:text-green-400'
                        )}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-foreground break-words">
                      <span className="text-muted-foreground">&gt; </span>
                      {log.prompt}
                    </p>
                    {log.response && (
                      <p className="mt-2 text-muted-foreground whitespace-pre-wrap break-words border-l-2 border-primary/30 pl-2">
                        {log.response}
                      </p>
                    )}
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
