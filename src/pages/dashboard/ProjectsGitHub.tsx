/**
 * Projects (GitHub) – project explorer: connect accounts, select repos,
 * view issues/PRs/commits, create issues, roadmaps and boards.
 */
import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  RepoSelector,
  RepoActivityFeed,
  IssueListDetailPanel,
  RoadmapMilestones,
  TaskBoard,
  AIPMActions,
} from '@/components/projects-github'
import {
  useProjectsGitHubRepos,
  useProjectsGitHubActivity,
  useProjectsGitHubIssues,
  useProjectsGitHubMilestones,
  useCreateGitHubIssue,
} from '@/hooks/useProjectsGitHub'
import { toast } from 'sonner'

const PAGE_TITLE = 'Projects (GitHub) | Atlas'
const PAGE_DESCRIPTION = 'Connect GitHub, select repos, view issues and PRs, create issues, and manage roadmaps and boards.'

export function ProjectsGitHubPage() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [activityFilterRepo, setActivityFilterRepo] = useState<string | null>(null)
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)

  const {
    data: repos = [],
    isLoading: reposLoading,
    isError: reposError,
    refetch: refetchRepos,
  } = useProjectsGitHubRepos()
  const {
    data: activityRaw = [],
    isLoading: activityLoading,
    isError: activityError,
    refetch: refetchActivity,
  } = useProjectsGitHubActivity(activityFilterRepo ?? undefined)
  const {
    data: issues = [],
    isLoading: issuesLoading,
    isError: issuesError,
    refetch: refetchIssues,
  } = useProjectsGitHubIssues(selectedRepo ?? '', {})
  const {
    data: milestones = [],
    isLoading: milestonesLoading,
    isError: milestonesError,
    refetch: refetchMilestones,
  } = useProjectsGitHubMilestones(selectedRepo ?? undefined)
  const createIssue = useCreateGitHubIssue()

  const activity = Array.isArray(activityRaw) ? activityRaw : []

  const reposList = repos.map((r) => r.full_name)

  const handleConnectGitHub = useCallback(() => {
    toast.info('Connect GitHub: configure OAuth in settings or use your backend callback.')
  }, [])

  const handleCreateIssue = useCallback(
    (payload: { repo: string; title: string; body?: string }) => {
      createIssue.mutate({ repo: payload.repo, title: payload.title, body: payload.body })
    },
    [createIssue]
  )

  const handleSummarizeActivity = useCallback(() => {
    toast.info('Summarize recent activity: connect AI/LLM backend for full summary.')
  }, [])

  const handleCreateIssuesFromGoal = useCallback(() => {
    toast.info('Create issues from goal: connect AI/LLM backend to generate issues from a goal.')
  }, [])

  const handleCreateMilestone = useCallback(() => {
    toast.info('Add milestone: use GitHub API or backend to create milestones.')
  }, [])

  const handleMoveIssue = useCallback((_issueId: string, _newState: 'open' | 'closed') => {
    toast.info('Update issue state: connect backend PATCH to change issue state.')
  }, [])

  useEffect(() => {
    document.title = PAGE_TITLE
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevContent = metaDesc?.getAttribute('content') ?? ''
    if (metaDesc) metaDesc.setAttribute('content', PAGE_DESCRIPTION)
    return () => {
      document.title = 'Atlas'
      if (metaDesc && prevContent) metaDesc.setAttribute('content', prevContent)
    }
  }, [])

  const hasReposError = reposError
  const hasSectionError = activityError || issuesError || milestonesError
  const handleRetryAll = useCallback(() => {
    refetchRepos()
    refetchActivity()
    if (selectedRepo) {
      refetchIssues()
      refetchMilestones()
    }
  }, [refetchRepos, refetchActivity, refetchIssues, refetchMilestones, selectedRepo])

  return (
    <div className="space-y-6 animate-fade-in-up motion-reduce:animate-none" role="main">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link
          to="/dashboard"
          className="transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-foreground font-medium">Projects (GitHub)</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-card-lg border border-border bg-card-secondary/50 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Projects (GitHub)
          </h1>
          <p className="mt-1 text-muted-foreground">
            Connect GitHub, select repos, view issues and PRs, create issues, and manage roadmaps and boards.
          </p>
        </div>
      </div>

      {(hasReposError || hasSectionError) && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden />
              <div>
                <p className="font-medium text-foreground">Something went wrong</p>
                <p className="text-sm text-muted-foreground">
                  {hasReposError
                    ? 'Could not load repositories. Check your connection or GitHub OAuth.'
                    : 'Some data could not be loaded.'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryAll}
              className="shrink-0 transition-transform duration-200 hover:scale-[1.02]"
              aria-label="Retry loading data"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <RepoSelector
        repos={repos}
        isLoading={reposLoading}
        selectedRepo={selectedRepo}
        onSelectRepo={setSelectedRepo}
        onConnectGitHub={handleConnectGitHub}
      />

      <Tabs defaultValue="activity" className="w-full" aria-label="Projects GitHub sections">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-card-secondary border border-border" aria-label="Sections">
          <TabsTrigger value="activity" id="activity-tab" aria-controls="activity-panel">
            Activity
          </TabsTrigger>
          <TabsTrigger value="issues" id="issues-tab" aria-controls="issues-panel">
            Issues
          </TabsTrigger>
          <TabsTrigger value="roadmap" id="roadmap-tab" aria-controls="roadmap-panel">
            Roadmap
          </TabsTrigger>
          <TabsTrigger value="board" id="board-tab" aria-controls="board-panel">
            Task board
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" id="activity-panel" className="mt-6 space-y-6" aria-labelledby="activity-tab">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RepoActivityFeed
                activity={activity}
                isLoading={activityLoading}
                repos={reposList}
                selectedRepo={activityFilterRepo}
                onFilterByRepo={setActivityFilterRepo}
              />
            </div>
            <div>
              <AIPMActions
                onSummarizeActivity={handleSummarizeActivity}
                onCreateIssuesFromGoal={handleCreateIssuesFromGoal}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="issues" id="issues-panel" className="mt-6" aria-labelledby="issues-tab">
          <IssueListDetailPanel
            issues={issues}
            isLoading={issuesLoading}
            selectedRepo={selectedRepo}
            selectedIssueId={selectedIssueId}
            onSelectIssue={setSelectedIssueId}
            onCreateIssue={handleCreateIssue}
            isCreatePending={createIssue.isPending}
          />
        </TabsContent>

        <TabsContent value="roadmap" id="roadmap-panel" className="mt-6" aria-labelledby="roadmap-tab">
          <RoadmapMilestones
            milestones={milestones}
            isLoading={milestonesLoading}
            selectedRepo={selectedRepo}
            onCreateMilestone={handleCreateMilestone}
          />
        </TabsContent>

        <TabsContent value="board" id="board-panel" className="mt-6" aria-labelledby="board-tab">
          <TaskBoard
            issues={issues}
            isLoading={issuesLoading}
            selectedRepo={selectedRepo}
            onMoveIssue={handleMoveIssue}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProjectsGitHubPage
