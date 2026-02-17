/**
 * Content Pipeline types aligned with DB schema and UI models.
 */

export interface ContentPipeline {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface ContentIdea {
  id: string
  title: string
  tags: string[]
  sourceLink?: string
  createdAt: string
  status: 'idea' | 'draft' | 'scheduled'
}

export interface DraftVersion {
  id: string
  content: string
  createdAt: string
  label?: string
}

export interface ContentDraft {
  id: string
  ideaId?: string
  title: string
  content: string
  versions: DraftVersion[]
  createdAt: string
  updatedAt: string
}

export type PlatformTag = 'twitter' | 'linkedin' | 'youtube' | 'blog' | 'newsletter' | 'instagram'

export interface CalendarPost {
  id: string
  draftId: string
  title: string
  scheduledDate: string
  platform: PlatformTag
  status: 'scheduled' | 'published' | 'draft'
}

export interface ContentAsset {
  id: string
  name: string
  type: 'thumbnail' | 'script' | 'outline' | 'other'
  url?: string
  size?: number
  createdAt: string
}

export interface ScheduledItem {
  id: string
  title: string
  scheduledAt: string
  platform: PlatformTag
  exportType?: 'manual' | 'google_calendar'
}
