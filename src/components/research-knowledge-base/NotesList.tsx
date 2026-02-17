import { useState, useMemo } from 'react'
import { FileText, Search, Tag, Bookmark, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Note, SavedSearch } from '@/types/research-knowledge-base'

export interface NotesListProps {
  notes: Note[]
  savedSearches?: SavedSearch[]
  isLoading?: boolean
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
  onNewNote?: () => void
  onSaveSearch?: (name: string, query: string, tags: string[]) => void
}

export function NotesList({
  notes,
  savedSearches = [],
  isLoading = false,
  selectedNoteId,
  onSelectNote,
  onNewNote,
}: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [activeSavedSearchId, setActiveSavedSearchId] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [notes])

  const filteredNotes = useMemo(() => {
    let list = notes
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (selectedTag) {
      list = list.filter((n) => n.tags.includes(selectedTag))
    }
    if (activeSavedSearchId) {
      const saved = savedSearches.find((s) => s.id === activeSavedSearchId)
      if (saved?.filters.tags?.length) {
        list = list.filter((n) =>
          saved.filters.tags!.some((t) => n.tags.includes(t))
        )
      }
    }
    return list
  }, [notes, searchQuery, selectedTag, activeSavedSearchId, savedSearches])

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Notes
          </CardTitle>
          <CardDescription>Filters, tags, and saved searches.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
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
            Notes
          </CardTitle>
          <CardDescription>Filters, tags, and saved searches.</CardDescription>
        </div>
        <Button
          size="sm"
          onClick={onNewNote}
          className="transition-transform duration-200 hover:scale-[1.02]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New note
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search notes"
          />
        </div>

        {savedSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Bookmark className="h-4 w-4 text-muted-foreground shrink-0" />
            {savedSearches.map((s) => (
              <Button
                key={s.id}
                variant={activeSavedSearchId === s.id ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  setActiveSavedSearchId(activeSavedSearchId === s.id ? null : s.id)
                }
              >
                {s.name}
              </Button>
            ))}
          </div>
        )}

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'secondary'}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:scale-[1.02]',
                  selectedTag === tag && 'ring-2 ring-primary/50'
                )}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {filteredNotes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-2">
              {notes.length === 0 ? 'No notes yet.' : 'No notes match your filters.'}
            </p>
            <p className="text-sm">
              {notes.length === 0
                ? 'Create a note or save a clip to get started.'
                : 'Try a different search or tag.'}
            </p>
            {notes.length === 0 && onNewNote && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={onNewNote}
              >
                <Plus className="mr-2 h-4 w-4" />
                New note
              </Button>
            )}
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {filteredNotes.map((note) => (
              <li key={note.id}>
                <button
                  type="button"
                  onClick={() => onSelectNote(note.id)}
                  className={cn(
                    'group flex w-full flex-col gap-1 rounded-lg border border-border p-3 text-left transition-all duration-200',
                    'hover:border-primary/30 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selectedNoteId === note.id &&
                      'border-primary/50 bg-primary/10 shadow-sm'
                  )}
                >
                  <span className="font-medium text-foreground line-clamp-1">
                    {note.title || 'Untitled'}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {note.content.slice(0, 80)}
                    {note.content.length > 80 ? '…' : ''}
                  </span>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {note.tags.slice(0, 3).map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
