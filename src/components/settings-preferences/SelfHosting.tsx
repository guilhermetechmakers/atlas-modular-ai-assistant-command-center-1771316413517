import { BookOpen, Container, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SelfHostingProps {
  isLoading?: boolean
  docsUrl?: string
  onCheckUpdates?: () => void
}

export function SelfHosting({
  isLoading = false,
  docsUrl = '/about#self-host',
  onCheckUpdates,
}: SelfHostingProps) {
  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Self-hosting
          </CardTitle>
          <CardDescription>Docker deployment docs and update controls.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Self-hosting
        </CardTitle>
        <CardDescription>
          Docker deployment docs and update controls.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card-secondary/50 p-4',
            'transition-all duration-200 hover:border-primary/30'
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Container className="h-5 w-5 text-foreground" />
            </span>
            <div>
              <p className="font-medium text-foreground">Deployment guide</p>
              <p className="text-sm text-muted-foreground">
                Run Atlas with Docker. Environment variables, volumes, and networking.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <a href={docsUrl}>View guide</a>
          </Button>
        </div>

        {onCheckUpdates && (
          <div
            className={cn(
              'flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4',
              'transition-colors duration-200 hover:border-primary/30'
            )}
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Updates</p>
                <p className="text-sm text-muted-foreground">
                  Check for new images and apply updates from your deployment environment.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onCheckUpdates}
              className="gap-2 transition-transform duration-200 hover:scale-[1.02]"
            >
              <RefreshCw className="h-4 w-4" />
              Check for updates
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Self-hosted instances are managed on your infrastructure. Backup and retention are your responsibility.
        </p>
      </CardContent>
    </Card>
  )
}
