import { useState, useCallback, useEffect } from 'react'
import { FileText, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IdeasList } from '@/components/content-pipeline/IdeasList'
import { DraftEditor } from '@/components/content-pipeline/DraftEditor'
import { ContentCalendar } from '@/components/content-pipeline/ContentCalendar'
import { AssetManager } from '@/components/content-pipeline/AssetManager'
import { RepurposeTool } from '@/components/content-pipeline/RepurposeTool'
import { PublishingScheduler } from '@/components/content-pipeline/PublishingScheduler'
import { toast } from 'sonner'
import type {
  ContentIdea,
  ContentDraft,
  DraftVersion,
  CalendarPost,
  ContentAsset,
  ScheduledItem,
  PlatformTag,
} from '@/types/content-pipeline'

function uuid() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function ContentPipelinePage() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [drafts, setDrafts] = useState<ContentDraft[]>([])
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
  const [calendarPosts, setCalendarPosts] = useState<CalendarPost[]>([])
  const [assets, setAssets] = useState<ContentAsset[]>([])
  const [scheduled, setScheduled] = useState<ScheduledItem[]>([])
  const [isLoading] = useState(false)

  const selectedDraft = selectedDraftId ? drafts.find((d) => d.id === selectedDraftId) ?? null : null

  useEffect(() => {
    document.title = 'Content Pipeline | Atlas'
    return () => {
      document.title = 'Atlas'
    }
  }, [])

  const handleAddIdea = useCallback(
    (payload: { title: string; tags: string[]; sourceLink?: string }) => {
      const idea: ContentIdea = {
        id: uuid(),
        title: payload.title,
        tags: payload.tags,
        sourceLink: payload.sourceLink,
        createdAt: new Date().toISOString(),
        status: 'idea',
      }
      setIdeas((prev) => [idea, ...prev])
      toast.success('Idea added')
    },
    []
  )

  const handleConvertToDraft = useCallback((idea: ContentIdea) => {
    const draft: ContentDraft = {
      id: uuid(),
      ideaId: idea.id,
      title: idea.title,
      content: '',
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setDrafts((prev) => [draft, ...prev])
    setSelectedDraftId(draft.id)
    toast.success('Draft created from idea')
  }, [])

  const handleNewDraft = useCallback(() => {
    const draft: ContentDraft = {
      id: uuid(),
      title: 'Untitled draft',
      content: '',
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setDrafts((prev) => [draft, ...prev])
    setSelectedDraftId(draft.id)
    toast.success('New draft created')
  }, [])

  const handleSaveDraft = useCallback((draftId: string, content: string, title: string) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id !== draftId) return d
        const newVersion: DraftVersion = {
          id: uuid(),
          content: d.content,
          createdAt: new Date().toISOString(),
          label: `Saved ${new Date().toLocaleTimeString()}`,
        }
        return {
          ...d,
          title,
          content,
          versions: [newVersion, ...d.versions].slice(0, 10),
          updatedAt: new Date().toISOString(),
        }
      })
    )
    toast.success('Draft saved')
  }, [])

  const handleRestoreVersion = useCallback((draftId: string, version: DraftVersion) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, content: version.content } : d))
    )
    toast.success('Version restored')
  }, [])

  const handleAiAssist = useCallback((_draftId: string, prompt: string) => {
    toast.info(`AI assist: "${prompt.slice(0, 30)}..." (connect backend for real assist)`)
  }, [])

  const handleSchedule = useCallback((draftId: string, date: string, platform: PlatformTag) => {
    const draft = drafts.find((d) => d.id === draftId)
    if (!draft) return
    const post: CalendarPost = {
      id: uuid(),
      draftId,
      title: draft.title,
      scheduledDate: date,
      platform,
      status: 'scheduled',
    }
    setCalendarPosts((prev) => [...prev, post])
    const item: ScheduledItem = {
      id: post.id,
      title: draft.title,
      scheduledAt: new Date(date).toISOString(),
      platform,
      exportType: 'manual',
    }
    setScheduled((prev) => [...prev, item])
    toast.success('Post scheduled')
  }, [drafts])

  const handleDragDrop = useCallback((postId: string, newDate: string) => {
    setCalendarPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, scheduledDate: newDate } : p))
    )
    setScheduled((prev) =>
      prev.map((s) =>
        s.id === postId ? { ...s, scheduledAt: new Date(newDate).toISOString() } : s
      )
    )
    toast.success('Post rescheduled')
  }, [])

  const handleUploadAssets = useCallback((files: File[], type: ContentAsset['type']) => {
    const newAssets: ContentAsset[] = files.map((f) => ({
      id: uuid(),
      name: f.name,
      type,
      size: f.size,
      createdAt: new Date().toISOString(),
    }))
    setAssets((prev) => [...newAssets, ...prev])
    toast.success(`${files.length} file(s) added`)
  }, [])

  const handleDeleteAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id))
    toast.success('Asset removed')
  }, [])

  const handleExportManual = useCallback((item: ScheduledItem) => {
    toast.success(`Export: ${item.title} (connect backend for file export)`)
  }, [])

  const handleAddToGoogleCalendar = useCallback((item: ScheduledItem) => {
    toast.success(`Add to Google Calendar: ${item.title} (connect backend for calendar link)`)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Content Pipeline
          </h1>
          <p className="mt-1 text-muted-foreground">
            Ideas → drafts → schedule → publish. Central workspace with platform tagging and calendar.
          </p>
        </div>
      </div>

      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-card-secondary border border-border">
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="repurpose">Repurpose</TabsTrigger>
          <TabsTrigger value="schedule">Publishing</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="mt-6">
          <IdeasList
            ideas={ideas}
            isLoading={isLoading}
            onAddIdea={handleAddIdea}
            onConvertToDraft={handleConvertToDraft}
          />
        </TabsContent>

        <TabsContent value="drafts" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Drafts</CardTitle>
                <Button size="sm" onClick={handleNewDraft}>
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
              </CardHeader>
              <CardContent>
                {drafts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No drafts. Create one or convert an idea.</p>
                ) : (
                  <ul className="space-y-2">
                    {drafts.map((d) => (
                      <li key={d.id}>
                        <Button
                          variant={selectedDraftId === d.id ? 'secondary' : 'ghost'}
                          className="w-full justify-start font-normal"
                          onClick={() => setSelectedDraftId(d.id)}
                        >
                          <FileText className="mr-2 h-4 w-4 shrink-0" />
                          <span className="truncate">{d.title}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            <div className="lg:col-span-2">
              <DraftEditor
                draft={selectedDraft}
                isLoading={isLoading}
                onSave={handleSaveDraft}
                onNewDraft={handleNewDraft}
                onRestoreVersion={handleRestoreVersion}
                onAiAssist={handleAiAssist}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <ContentCalendar
            posts={calendarPosts}
            isLoading={isLoading}
            onSchedule={handleSchedule}
            onDragDrop={handleDragDrop}
          />
        </TabsContent>

        <TabsContent value="assets" className="mt-6">
          <AssetManager
            assets={assets}
            isLoading={isLoading}
            onUpload={handleUploadAssets}
            onDelete={handleDeleteAsset}
          />
        </TabsContent>

        <TabsContent value="repurpose" className="mt-6">
          <RepurposeTool sourceContent={selectedDraft?.content} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <PublishingScheduler
            scheduled={scheduled}
            isLoading={isLoading}
            onExportManual={handleExportManual}
            onAddToGoogleCalendar={handleAddToGoogleCalendar}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
