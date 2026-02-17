/**
 * Issue List & Detail Panel – search, filter, create issue modal mapped to github.create_issue.
 */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Plus, Search, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { GitHubIssue } from '@/types/projects-github'

const createIssueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().optional(),
})

type CreateIssueForm = z.infer<typeof createIssueSchema>

export interface IssueListDetailPanelProps {
  issues: GitHubIssue[]
  isLoading?: boolean
  selectedRepo: string | null
  selectedIssueId: string | null
  onSelectIssue: (id: string | null) => void
  onCreateIssue: (payload: { repo: string; title: string; body?: string }) => void
  isCreatePending?: boolean
}

export function IssueListDetailPanel({
  issues,
  isLoading = false,
  selectedRepo,
  selectedIssueId,
  onSelectIssue,
  onCreateIssue,
  isCreatePending = false,
}: IssueListDetailPanelProps) {
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<'open' | 'closed'>('open')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = issues.filter((issue) => {
    const matchSearch =
      !search.trim() ||
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      String(issue.number).includes(search)
    const matchState = issue.state === stateFilter
    return matchSearch && matchState
  })

  const selectedIssue = selectedIssueId
    ? issues.find((i) => i.id === selectedIssueId) ?? null
    : null

  return (
    <>
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-5 w-5 text-primary" />
              Issues
            </CardTitle>
            <CardDescription>Search, filter, and create issues. Mapped to github.create_issue.</CardDescription>
          </div>
          {selectedRepo && (
            <Button
              size="sm"
              onClick={() => setCreateOpen(true)}
              className="transition-transform duration-200 hover:scale-[1.02]"
            >
              <Plus className="mr-2 h-4 w-4" />
              New issue
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedRepo ? (
            <div
              className="rounded-lg border border-dashed border-border p-6 text-center"
              role="status"
            >
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Select a repo to view and create issues.</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search issues..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    aria-label="Search issues"
                  />
                </div>
                <Button
                  variant={stateFilter === 'open' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setStateFilter('open')}
                >
                  Open
                </Button>
                <Button
                  variant={stateFilter === 'closed' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setStateFilter('closed')}
                >
                  Closed
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ul className="space-y-2 md:col-span-1 lg:col-span-1" role="list">
                  {filtered.length === 0 ? (
                    <li className="text-sm text-muted-foreground">No issues match.</li>
                  ) : (
                    filtered.map((issue) => (
                      <li key={issue.id}>
                        <button
                          type="button"
                          onClick={() => onSelectIssue(selectedIssueId === issue.id ? null : issue.id)}
                          className={cn(
                            'w-full rounded-lg border p-3 text-left transition-all duration-200',
                            'hover:border-primary/30 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            selectedIssueId === issue.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-card'
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-foreground text-sm truncate flex-1">
                              #{issue.number} {issue.title}
                            </span>
                            <Badge variant={issue.state === 'open' ? 'default' : 'secondary'} className="shrink-0">
                              {issue.state}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground truncate">{issue.repo}</p>
                        </button>
                      </li>
                    ))
                  )}
                </ul>

                <div className="md:col-span-1 lg:col-span-2">
                  {selectedIssue ? (
                    <Card className="border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          #{selectedIssue.number} {selectedIssue.title}
                          {selectedIssue.html_url && (
                            <a
                              href={selectedIssue.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                              aria-label="Open on GitHub"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={selectedIssue.state === 'open' ? 'default' : 'secondary'}>
                            {selectedIssue.state}
                          </Badge>
                          {selectedIssue.labels?.map((l) => (
                            <Badge key={l.name} variant="outline" style={{ borderColor: l.color }}>
                              {l.name}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {selectedIssue.body ? (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedIssue.body}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No description.</p>
                        )}
                        <p className="mt-3 text-xs text-muted-foreground">
                          Updated {new Date(selectedIssue.updated_at).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center"
                      role="status"
                    >
                      <AlertCircle className="h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Select an issue to view details.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <CreateIssueDialog
          repo={selectedRepo ?? ''}
          onClose={() => setCreateOpen(false)}
          onSubmit={(payload) => {
            onCreateIssue(payload)
            setCreateOpen(false)
          }}
          isPending={isCreatePending}
        />
      </Dialog>
    </>
  )
}

interface CreateIssueDialogProps {
  repo: string
  onClose: () => void
  onSubmit: (payload: { repo: string; title: string; body?: string }) => void
  isPending: boolean
}

function CreateIssueDialog({ repo, onClose, onSubmit, isPending }: CreateIssueDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateIssueForm>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: { title: '', body: '' },
  })

  const onFormSubmit = (data: CreateIssueForm) => {
    onSubmit({ repo, title: data.title, body: data.body })
    reset()
  }

  return (
    <DialogContent showClose className="max-w-lg" aria-describedby="create-issue-desc">
      <DialogHeader>
        <DialogTitle>Create issue</DialogTitle>
        <DialogDescription id="create-issue-desc">
          Create a new issue in {repo}. Title is required; description is optional.
        </DialogDescription>
        <p className="text-sm text-muted-foreground">Repo: {repo}</p>
      </DialogHeader>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="issue-title">Title</Label>
          <Input
            id="issue-title"
            placeholder="Issue title"
            {...register('title')}
            className={errors.title ? 'border-destructive' : ''}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-xs text-destructive" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="issue-body">Description (optional)</Label>
          <Textarea
            id="issue-body"
            placeholder="Body"
            rows={4}
            {...register('body')}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create issue'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
