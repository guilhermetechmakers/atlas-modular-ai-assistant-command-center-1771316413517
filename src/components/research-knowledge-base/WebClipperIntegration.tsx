import { useState } from 'react'
import { Link2, Save, Tag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export interface WebClipperIntegrationProps {
  onSaveClip?: (clip: { url: string; title: string; snapshot?: string; tags: string[] }) => void
  isLoading?: boolean
}

export function WebClipperIntegration({
  onSaveClip,
  isLoading = false,
}: WebClipperIntegrationProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [snapshot, setSnapshot] = useState('')
  const [tagsStr, setTagsStr] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsStr
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
    if (!url.trim()) {
      toast.error('URL is required')
      return
    }
    onSaveClip?.({
      url: url.trim(),
      title: title.trim() || url.trim(),
      snapshot: snapshot.trim() || undefined,
      tags,
    })
    setUrl('')
    setTitle('')
    setSnapshot('')
    setTagsStr('')
    toast.success('Clip saved')
  }

  if (isLoading) {
    return (
      <Card className="rounded-xl border border-border bg-card shadow-card transition-all duration-300" aria-busy="true" aria-label="Loading web clipper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" aria-hidden />
            Web Clipper
          </CardTitle>
          <CardDescription>Save URLs with metadata and snapshots.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Web Clipper
        </CardTitle>
        <CardDescription>Save URLs with metadata and snapshots.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clip-url">URL</Label>
            <Input
              id="clip-url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="transition-colors duration-200 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clip-title">Title</Label>
            <Input
              id="clip-title"
              placeholder="Page or article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clip-snapshot">Snapshot / excerpt</Label>
            <Textarea
              id="clip-snapshot"
              placeholder="Paste selected text or summary..."
              value={snapshot}
              onChange={(e) => setSnapshot(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clip-tags" className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              Tags
            </Label>
            <Input
              id="clip-tags"
              placeholder="tag1, tag2"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Save web clip"
          >
            <Save className="mr-2 h-4 w-4" />
            Save clip
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
