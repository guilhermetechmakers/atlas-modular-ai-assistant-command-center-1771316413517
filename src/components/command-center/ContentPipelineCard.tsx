import { Link } from 'react-router-dom'
import { FileText, Lightbulb, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useContentPipelineSummary } from '@/hooks/useCommandCenter'

export function ContentPipelineCard() {
  const { data, isLoading, isError } = useContentPipelineSummary()
  const summary = data ?? { dueDrafts: 0, scheduledPosts: 0 }

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            Content Pipeline
          </CardTitle>
          <Link to="/content-pipeline">
            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>Due drafts, scheduled posts, quick-create idea.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        )}
        {isError && (
          <p className="text-sm text-muted-foreground">Could not load content summary.</p>
        )}
        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-card-secondary/50 p-4">
                <p className="text-2xl font-semibold text-foreground">{summary.dueDrafts}</p>
                <p className="text-xs text-muted-foreground">Due drafts</p>
              </div>
              <div className="rounded-lg border border-border bg-card-secondary/50 p-4">
                <p className="text-2xl font-semibold text-foreground">{summary.scheduledPosts}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
            {summary.latestIdea && (
              <p className="text-sm text-muted-foreground truncate" title={summary.latestIdea}>
                Latest idea: {summary.latestIdea}
              </p>
            )}
            <Link to="/content-pipeline">
              <Button size="sm" className="w-full transition-transform hover:scale-[1.02]">
                <Lightbulb className="mr-2 h-4 w-4" />
                Quick-create idea
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}
