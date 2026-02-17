import { useState, useCallback, useEffect } from 'react'
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
import { toast } from 'sonner'
import type {
  Note,
  SavedSearch,
  WebClip,
  SourceAttachment,
} from '@/types/research-knowledge-base'

function uuid() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function ResearchPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [clips, setClips] = useState<WebClip[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [compareLeft, setCompareLeft] = useState<{ id: string; title: string; content: string; meta?: string } | null>(null)
  const [compareRight, setCompareRight] = useState<{ id: string; title: string; content: string; meta?: string } | null>(null)
  const [vectorSearchEnabled, setVectorSearchEnabled] = useState(false)
  const [isLoading] = useState(false)

  const selectedNote = selectedNoteId
    ? notes.find((n) => n.id === selectedNoteId) ?? null
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
      setNotes((prev) =>
        prev.map((n) =>
          n.id !== noteId
            ? n
            : {
                ...n,
                ...payload,
                updatedAt: new Date().toISOString(),
              }
        )
      )
      toast.success('Note saved')
    },
    []
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Research & Knowledge Base
          </h1>
          <p className="mt-1 text-muted-foreground">
            Save web clips, notes, summaries, and decisions. Tagging, search, and AI summarization with citations.
          </p>
        </div>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-card-secondary border border-border">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="clipper">Web Clipper</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="settings">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <NotesList
                notes={notes}
                savedSearches={savedSearches}
                isLoading={isLoading}
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
                onNewNote={handleNewNote}
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
