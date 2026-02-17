/**
 * Research & Knowledge Base types aligned with DB schema and UI models.
 * Table: research_knowledge_base (research_&_knowledge_base in SQL).
 */

export interface ResearchKnowledgeBase {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Citation {
  id: string
  sourceTitle?: string
  sourceUrl?: string
  excerpt?: string
  accessedAt?: string
}

export interface SourceAttachment {
  id: string
  url: string
  title?: string
  snapshot?: string
  addedAt: string
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  tags: string[]
  sourceAttachments: SourceAttachment[]
  citationMetadata: Citation[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'archived'
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: { tags?: string[] }
  createdAt: string
}

export interface WebClip {
  id: string
  url: string
  title: string
  metadata?: Record<string, string>
  snapshot?: string
  tags: string[]
  createdAt: string
}
