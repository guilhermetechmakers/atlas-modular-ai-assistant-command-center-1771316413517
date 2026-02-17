import { Columns, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface CompareItem {
  id: string
  title: string
  content: string
  meta?: string
}

export interface CompareViewProps {
  left?: CompareItem | null
  right?: CompareItem | null
  onSelectLeft?: () => void
  onSelectRight?: () => void
  isLoading?: boolean
}

/**
 * Side-by-side comparison of saved items or tool analyses.
 */
export function CompareView({
  left,
  right,
  onSelectLeft,
  onSelectRight,
  isLoading = false,
}: CompareViewProps) {
  if (isLoading) {
    return (
      <Card className="rounded-xl border border-border bg-card shadow-card transition-all duration-300" aria-busy="true" aria-label="Loading compare view">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Columns className="h-5 w-5 text-primary" aria-hidden />
            Compare
          </CardTitle>
          <CardDescription>Side-by-side comparison of saved items or analyses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const emptySlot = (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card-secondary/30 py-12 text-center text-muted-foreground"
      role="status"
    >
      <FileText className="h-10 w-10 opacity-50" aria-hidden />
      <p className="mt-2 text-sm">Select an item to compare</p>
      <p className="mt-1 text-xs text-muted-foreground/80">Use the Notes tab and set Left/Right from the current note.</p>
    </div>
  )

  return (
    <Card className="rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Columns className="h-5 w-5 text-primary" />
          Compare
        </CardTitle>
        <CardDescription>Side-by-side comparison of saved items or tool analyses.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Left</span>
              {onSelectLeft && (
                <Button variant="ghost" size="sm" onClick={onSelectLeft}>
                  Change
                </Button>
              )}
            </div>
            {left ? (
              <div
                className={cn(
                  'rounded-xl border border-border bg-card-secondary/50 p-4',
                  'transition-all duration-200 hover:shadow-sm hover:border-primary/20'
                )}
              >
                <h4 className="font-medium text-foreground">{left.title}</h4>
                {left.meta && (
                  <p className="text-xs text-muted-foreground mt-1">{left.meta}</p>
                )}
                <div className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap line-clamp-6">
                  {left.content}
                </div>
              </div>
            ) : (
              emptySlot
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Right</span>
              {onSelectRight && (
                <Button variant="ghost" size="sm" onClick={onSelectRight}>
                  Change
                </Button>
              )}
            </div>
            {right ? (
              <div
                className={cn(
                  'rounded-xl border border-border bg-card-secondary/50 p-4',
                  'transition-all duration-200 hover:shadow-sm hover:border-primary/20'
                )}
              >
                <h4 className="font-medium text-foreground">{right.title}</h4>
                {right.meta && (
                  <p className="text-xs text-muted-foreground mt-1">{right.meta}</p>
                )}
                <div className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap line-clamp-6">
                  {right.content}
                </div>
              </div>
            ) : (
              emptySlot
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
