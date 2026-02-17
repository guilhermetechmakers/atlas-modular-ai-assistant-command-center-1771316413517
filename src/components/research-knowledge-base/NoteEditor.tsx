import { useState, useEffect } from 'react'
import { FileText, Link2, Quote, Save, Trash2, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import type { Note, SourceAttachment, Citation } from '@/types/research-knowledge-base'

export interface NoteEditorProps {
  note: Note | null
  isLoading?: boolean
  onSave?: (noteId: string, payload: { title: string; content: string; tags: string[] }) => void
  onDelete?: (noteId: string) => void
  onAddSource?: (noteId: string, url: string, title?: string) => void
  onRemoveSource?: (noteId: string, sourceId: string) => void
}

export function NoteEditor({
  note,
  isLoading = false,
  onSave,
  onDelete,
  onAddSource,
  onRemoveSource,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [tagsStr, setTagsStr] = useState(note?.tags.join(', ') ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [newSourceUrl, setNewSourceUrl] = useState('')
  const [newSourceTitle, setNewSourceTitle] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setTagsStr(note.tags.join(', '))
    }
  }, [note?.id, note?.title, note?.content, note?.tags])

  const handleSave = () => {
    if (!note) return
    setIsSaving(true)
    const tags = tagsStr
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
    onSave?.(note.id, { title, content, tags })
    setTimeout(() => setIsSaving(false), 300)
  }

  const handleAddSource = () => {
    if (!note || !newSourceUrl.trim()) return
    onAddSource?.(note.id, newSourceUrl.trim(), newSourceTitle.trim() || undefined)
    setNewSourceUrl('')
    setNewSourceTitle('')
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Note
          </CardTitle>
          <CardDescription>Rich text with source attachments and citation metadata.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!note) {
    return (
      <Card className="transition-all duration-300 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-muted-foreground">Select a note or create one to edit.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Note editor
          </CardTitle>
          <CardDescription>Rich text with source attachments and citation metadata.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
              onClick={() => onDelete(note.id)}
              aria-label="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="note-title">Title</Label>
          <Input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="note-content">Content</Label>
            <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {content.length} characters
            </span>
          </div>
          <Textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note (Markdown supported)"
            className="min-h-[200px] font-mono text-sm transition-colors duration-200 focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="note-tags">Tags</Label>
          <Input
            id="note-tags"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="tag1, tag2"
          />
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <Label>Source attachments</Label>
          </div>
          {note.sourceAttachments.length > 0 && (
            <ul className="space-y-2">
              {note.sourceAttachments.map((src: SourceAttachment) => (
                <li
                  key={src.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card-secondary/50 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate block"
                    >
                      {src.title || src.url}
                    </a>
                    <span className="text-xs text-muted-foreground">{src.url}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    onClick={() => onRemoveSource?.(note.id, src.id)}
                    aria-label="Remove source"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="https://..."
              value={newSourceUrl}
              onChange={(e) => setNewSourceUrl(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Title (optional)"
              value={newSourceTitle}
              onChange={(e) => setNewSourceTitle(e.target.value)}
              className="w-32"
            />
            <Button size="sm" variant="outline" onClick={handleAddSource}>
              Add source
            </Button>
          </div>
        </div>

        {note.citationMetadata.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-primary" />
              <Label>Citations</Label>
            </div>
            <ul className="space-y-2">
              {note.citationMetadata.map((c: Citation) => (
                <li
                  key={c.id}
                  className="rounded-lg border border-border bg-card-secondary/50 px-3 py-2 text-sm"
                >
                  {c.sourceTitle && <span className="font-medium">{c.sourceTitle}</span>}
                  {c.sourceUrl && (
                    <a
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      Source
                    </a>
                  )}
                  {c.excerpt && (
                    <p className="text-muted-foreground mt-1 line-clamp-2">{c.excerpt}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
