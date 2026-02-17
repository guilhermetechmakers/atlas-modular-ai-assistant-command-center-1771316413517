import { useState, useCallback, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  NotesList,
  NoteEditor,
  WebClipperIntegration,
  SummarizeButton,
  CompareView,
  VectorSearchToggle,
} from '@/components/research-knowledge-base'
import { useResearchKnowledgeBases } from '@/hooks/useResearchKnowledgeBase'
import { toast } from 'sonner'
import type {
  Note,
  SavedSearch,
  WebClip,
  SourceAttachment,
} from '@/types/research-knowledge-base'
import { ChevronRight } from 'lucide-react'

function uuid() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function mapApiToNote(r: { id: string; user_id: string; title: string; description?: string; status: string; created_at: string; updated_at: string }): Note {
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title,
    content: r.description ?? '',
    tags: [],
    sourceAttachments: [],
    citationMetadata: [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    status: r.status as 'active' | 'archived',
  }
}

export function ResearchPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [clips, setClips] = useState<WebClip[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [compareLeft, setCompareLeft] = useState<{ id: string; title: string; content: string; meta?: string } | null>(null)
  const [compareRight, setCompareRight] = useState<{ id: string; title: string; content: string; meta?: string } | null>(null)
  const [vectorSearchEnabled, setVectorSearchEnabled] = useState(false)

  const { data: apiList, isLoading: apiLoading, isError: apiError } = useResearchKnowledgeBases(undefined)

  const mergedNotes = useMemo(() => {
    if (apiError || !apiList?.length) return notes
    const apiNotes = apiList.map(mapApiToNote)
    const apiIds = new Set(apiNotes.map((n) => n.id))
    const localOnly = notes.filter((n) => !apiIds.has(n.id))
    return [...apiNotes, ...localOnly].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }, [apiList, apiError, notes])

  const isLoading = apiLoading
  const selectedNote = selectedNoteId
    ? mergedNotes.find((n) => n.id === selectedNoteId) ?? null
    : null

  useEffect(() => {
    document.title = 'Research & Knowledge Base | Atlas'
    return () => {
      document.title = 'Atlas'
    }
  }, [])

  const handleNewNote = useCallback(() => {
    const note: Note = {
      id: uuid(),
      userId: '',
      title: 'Untitled note',
      content: '',
      tags: [],
      sourceAttachments: [],
      citationMetadata: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    }
    setNotes((prev) => [note, ...prev])
    setSelectedNoteId(note.id)
    toast.success('Note created')
  }, [])

  const handleSaveNote = useCallback(
    (noteId: string, payload: { title: string; content: string; tags: string[] }) => {
      const existing = mergedNotes.find((n) => n.id === noteId)
      const updated: Note = existing
        ? { ...existing, ...payload, updatedAt: new Date().toISOString() }
        : {
            id: noteId,
            userId: '',
            title: payload.title,
            content: payload.content,
            tags: payload.tags,
            sourceAttachments: [],
            citationMetadata: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
          }
      setNotes((prev) => {
        if (prev.some((n) => n.id === noteId)) {
          return prev.map((n) => (n.id !== noteId ? n : updated))
        }
        return [updated, ...prev]
      })
      toast.success('Note saved')
    },
    [mergedNotes]
  )

  const handleAddSource = useCallback((noteId: string, url: string, title?: string) => {
    const attachment: SourceAttachment = {
      id: uuid(),
      url,
      title: title || url,
      addedAt: new Date().toISOString(),
    }
    setNotes((prev) =>
      prev.map((n) =>
        n.id !== noteId
          ? n
          : {
              ...n,
              sourceAttachments: [...n.sourceAttachments, attachment],
              updatedAt: new Date().toISOString(),
            }
      )
    )
    toast.success('Source added')
  }, [])

  const handleRemoveSource = useCallback((noteId: string, sourceId: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id !== noteId
          ? n
          : {
              ...n,
              sourceAttachments: n.sourceAttachments.filter((s) => s.id !== sourceId),
              updatedAt: new Date().toISOString(),
            }
      )
    )
    toast.success('Source removed')
  }, [])

  const handleSaveSearch = useCallback((name: string, query: string, tags: string[]) => {
    const saved: SavedSearch = {
      id: uuid(),
      name,
      query,
      filters: { tags: tags.length ? tags : undefined },
      createdAt: new Date().toISOString(),
    }
    setSavedSearches((prev) => [saved, ...prev])
    toast.success('Search saved')
  }, [])

  const handleSaveClip = useCallback(
    (clip: { url: string; title: string; snapshot?: string; tags: string[] }) => {
      const webClip: WebClip = {
        id: uuid(),
        url: clip.url,
        title: clip.title,
        snapshot: clip.snapshot,
        tags: clip.tags,
        createdAt: new Date().toISOString(),
      }
      setClips((prev) => [webClip, ...prev])
      const note: Note = {
        id: uuid(),
        userId: '',
        title: clip.title,
        content: clip.snapshot ?? '',
        tags: clip.tags,
        sourceAttachments: [
          {
            id: uuid(),
            url: clip.url,
            title: clip.title,
            snapshot: clip.snapshot,
            addedAt: new Date().toISOString(),
          },
        ],
        citationMetadata: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      }
      setNotes((prev) => [note, ...prev])
      setSelectedNoteId(note.id)
    },
    []
  )

  const handleSummarize = useCallback((_selection?: string) => {
    toast.info('Connect an AI backend for summarization with citations.')
  }, [])

  const handleSelectForCompareLeft = useCallback(() => {
    if (selectedNote) {
      setCompareLeft({
        id: selectedNote.id,
        title: selectedNote.title,
        content: selectedNote.content,
        meta: selectedNote.updatedAt,
      })
      toast.success('Set as left panel')
    }
  }, [selectedNote])

  const handleSelectForCompareRight = useCallback(() => {
    if (selectedNote) {
      setCompareRight({
        id: selectedNote.id,
        title: selectedNote.title,
        content: selectedNote.content,
        meta: selectedNote.updatedAt,
      })
      toast.success('Set as right panel')
    }
  }, [selectedNote])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link
          to="/dashboard"
          className="transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-foreground font-medium">Research & Knowledge Base</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-transparent to-atlas-cyan/10 rounded-lg blur-sm" aria-hidden />
          <div className="relative">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Research & Knowledge Base
            </h1>
            <p className="mt-1 text-muted-foreground">
              Save web clips, notes, summaries, and decisions. Tagging, search, and AI summarization with citations.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-card-secondary border border-border rounded-lg">
          <TabsTrigger value="notes" className="rounded-md transition-all duration-200 data-[state=active]:shadow-sm">
            Notes
          </TabsTrigger>
          <TabsTrigger value="clipper" className="rounded-md transition-all duration-200 data-[state=active]:shadow-sm">
            Web Clipper
          </TabsTrigger>
          <TabsTrigger value="compare" className="rounded-md transition-all duration-200 data-[state=active]:shadow-sm">
            Compare
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-md transition-all duration-200 data-[state=active]:shadow-sm">
            Search
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <NotesList
                notes={mergedNotes}
                savedSearches={savedSearches}
                isLoading={isLoading}
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
                onNewNote={handleNewNote}
                onSaveSearch={handleSaveSearch}
              />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <NoteEditor
                note={selectedNote}
                isLoading={isLoading}
                onSave={handleSaveNote}
                onAddSource={handleAddSource}
                onRemoveSource={handleRemoveSource}
              />
              {selectedNote && (
                <Card className="transition-all duration-300 hover:shadow-card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Summarize</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SummarizeButton
                      selection={selectedNote.content.slice(0, 500)}
                      onSummarize={handleSummarize}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clipper" className="mt-6">
          <div className="max-w-xl">
            <WebClipperIntegration onSaveClip={handleSaveClip} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="compare" className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectForCompareLeft}
              disabled={!selectedNote}
            >
              Use current note as Left
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectForCompareRight}
              disabled={!selectedNote}
            >
              Use current note as Right
            </Button>
          </div>
          <CompareView
            left={compareLeft}
            right={compareRight}
            onSelectLeft={() => setCompareLeft(null)}
            onSelectRight={() => setCompareRight(null)}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="max-w-md space-y-4">
            <VectorSearchToggle
              enabled={vectorSearchEnabled}
              onToggle={setVectorSearchEnabled}
              disabled
            />
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Semantic search (embeddings/vector) will be available in a future release. For now, use the search and tag filters in the Notes tab.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
