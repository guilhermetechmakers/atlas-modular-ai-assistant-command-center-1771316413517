import { FileText, Plus, Calendar, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function ContentPipelinePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Content Pipeline</h1>
          <p className="mt-1 text-muted-foreground">Ideas → drafts → schedule → publish.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add content
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Ideas
            </CardTitle>
            <CardDescription>Capture and prioritize content ideas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full">Quick capture idea</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Content calendar
            </CardTitle>
            <CardDescription>Schedule and view drafts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Drafts
          </CardTitle>
          <CardDescription>WYSIWYG/Markdown editor, version history, repurpose tool.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-2">No drafts yet. Add an idea or create a draft.</p>
            <Button variant="outline" size="sm" className="mt-3">New draft</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
