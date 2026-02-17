import { useState } from 'react'
import { Lightbulb, Plus, Link2, Tag, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ContentIdea } from '@/types/content-pipeline'

export interface IdeasListProps {
  ideas: ContentIdea[]
  isLoading?: boolean
  onAddIdea?: (idea: { title: string; tags: string[]; sourceLink?: string }) => void
  onConvertToDraft?: (idea: ContentIdea) => void
}

export function IdeasList({
  ideas,
  isLoading = false,
  onAddIdea,
  onConvertToDraft,
}: IdeasListProps) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [tagsStr, setTagsStr] = useState('')
  const [sourceLink, setSourceLink] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsStr
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
    onAddIdea?.({ title: title.trim(), tags, sourceLink: sourceLink.trim() || undefined })
    setTitle('')
    setTagsStr('')
    setSourceLink('')
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Ideas
          </CardTitle>
          <CardDescription>Capture quick ideas with tags and source link.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Ideas
          </CardTitle>
          <CardDescription>Capture quick ideas with tags and source link.</CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="transition-transform duration-200 hover:scale-[1.02]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add idea
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-border bg-card-secondary/50 p-4 space-y-3 animate-fade-in"
          >
            <div className="space-y-2">
              <Label htmlFor="idea-title">Idea</Label>
              <Input
                id="idea-title"
                placeholder="Quick idea or headline..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea-tags" className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                Tags
              </Label>
              <Input
                id="idea-tags"
                placeholder="tag1, tag2"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea-source" className="flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5" />
                Source link
              </Label>
              <Input
                id="idea-source"
                type="url"
                placeholder="https://..."
                value={sourceLink}
                onChange={(e) => setSourceLink(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Save idea
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {ideas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-muted-foreground">
            <Lightbulb className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-2">No ideas yet.</p>
            <p className="text-sm">Add an idea with tags and an optional source link.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add first idea
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {ideas.map((idea) => (
              <li
                key={idea.id}
                className={cn(
                  'group flex flex-col gap-2 rounded-lg border border-border p-3 transition-all duration-200',
                  'hover:border-primary/30 hover:shadow-sm'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-foreground">{idea.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => onConvertToDraft?.(idea)}
                  >
                    To draft
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {idea.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {idea.sourceLink && (
                    <a
                      href={idea.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Source
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
