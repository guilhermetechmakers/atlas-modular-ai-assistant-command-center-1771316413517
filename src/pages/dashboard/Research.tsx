import { BookOpen, Plus, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export function ResearchPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Research & Knowledge Base</h1>
          <p className="mt-1 text-muted-foreground">Notes, clips, summaries, and citations.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New note
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Full-text search, tags, and web clipper integration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-9" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Summarize & compare
          </CardTitle>
          <CardDescription>AI summarization with citations; compare view for decisions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm">Summarize selection</Button>
        </CardContent>
      </Card>
    </div>
  )
}
