import { Search, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export interface VectorSearchToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  disabled?: boolean
  className?: string
}

/**
 * Toggle for semantic / vector search (future).
 * When enabled, search uses embeddings for semantic similarity.
 */
export function VectorSearchToggle({
  enabled,
  onToggle,
  disabled = true,
  className,
}: VectorSearchToggleProps) {
  return (
    <Card
      className={cn(
        'rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover',
        disabled && 'opacity-70',
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Search className="h-4 w-4 text-primary" aria-hidden />
          Semantic search
        </CardTitle>
        <CardDescription>Use embeddings for vector search (coming soon).</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <Label
          htmlFor="vector-search-toggle"
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden />
          Embeddings / vector search
        </Label>
        <Switch
          id="vector-search-toggle"
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={disabled}
          aria-label="Toggle semantic search (vector search)"
        />
      </CardContent>
    </Card>
  )
}
