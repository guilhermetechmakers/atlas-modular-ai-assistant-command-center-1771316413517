import { useState, useEffect } from 'react'
import { FileText, History, Sparkles, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ContentDraft, DraftVersion } from '@/types/content-pipeline'

export interface DraftEditorProps {
  draft: ContentDraft | null
  isLoading?: boolean
  onSave?: (draftId: string, content: string, title: string) => void
  onNewDraft?: () => void
  onRestoreVersion?: (draftId: string, version: DraftVersion) => void
  onAiAssist?: (draftId: string, prompt: string) => void
}

export function DraftEditor({
  draft,
  isLoading = false,
  onSave,
  onNewDraft,
  onRestoreVersion,
  onAiAssist,
}: DraftEditorProps) {
  const [title, setTitle] = useState(draft?.title ?? '')
  const [content, setContent] = useState(draft?.content ?? '')
  const [showVersions, setShowVersions] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (draft) {
      setTitle(draft.title)
      setContent(draft.content)
    }
  }, [draft?.id, draft?.title, draft?.content])

  const handleSave = () => {
    if (!draft) return
    setIsSaving(true)
    onSave?.(draft.id, content, title)
    setTimeout(() => setIsSaving(false), 300)
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Draft
          </CardTitle>
          <CardDescription>WYSIWYG/Markdown editor with versioning and AI assist.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!draft) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Drafts
          </CardTitle>
          <CardDescription>
            WYSIWYG/Markdown editor with versioning and AI assist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-2">No draft selected.</p>
            <p className="text-sm">Create a new draft or pick an idea to turn into a draft.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={onNewDraft}>
              New draft
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Draft editor
          </CardTitle>
          <CardDescription>Edit with version history and AI assist.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVersions(!showVersions)}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <History className="mr-2 h-4 w-4" />
            Versions
          </Button>
          <Button
            size="sm"
            disabled={isSaving}
            onClick={handleSave}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showVersions && draft.versions.length > 0 && (
          <div className="rounded-lg border border-border bg-card-secondary/50 p-4 space-y-2 animate-fade-in">
            <p className="text-sm font-medium text-foreground">Version history</p>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {draft.versions.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground truncate">
                    {v.label ?? new Date(v.createdAt).toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRestoreVersion?.(draft.id, v)}
                  >
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="draft-title">Title</Label>
          <Input
            id="draft-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Draft title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="draft-content">Content (Markdown)</Label>
          <Textarea
            id="draft-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content in Markdown..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <div className="rounded-lg border border-border p-4 space-y-2">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI assist
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Shorten this, add a CTA..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAiAssist?.(draft.id, aiPrompt)}
              disabled={!aiPrompt.trim()}
            >
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
