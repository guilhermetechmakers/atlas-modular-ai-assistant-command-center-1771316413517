import { useState } from 'react'
import { Copy, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { PlatformTag } from '@/types/content-pipeline'

const PLATFORMS: { value: PlatformTag; label: string }[] = [
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'blog', label: 'Blog' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'instagram', label: 'Instagram' },
]

export interface RepurposeToolProps {
  sourceContent?: string
  generated?: Record<PlatformTag, string>
  isLoading?: boolean
  onGenerate?: (source: string, platforms: PlatformTag[]) => void
}

export function RepurposeTool({
  sourceContent = '',
  generated: generatedProp,
  isLoading = false,
  onGenerate,
}: RepurposeToolProps) {
  const [source, setSource] = useState(sourceContent)
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformTag[]>(['twitter', 'linkedin'])
  const [generatedLocal, setGeneratedLocal] = useState<Record<PlatformTag, string>>({} as Record<PlatformTag, string>)
  const generated = generatedProp ?? generatedLocal
  const [isGenerating, setIsGenerating] = useState(false)

  const togglePlatform = (p: PlatformTag) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  const handleGenerate = () => {
    if (!source.trim()) return
    setIsGenerating(true)
    onGenerate?.(source, selectedPlatforms)
    setTimeout(() => {
      const next: Record<string, string> = {}
      selectedPlatforms.forEach((p) => {
        next[p] = `[${p}] Adapted version:\n\n${source.slice(0, 200)}...`
      })
      setGeneratedLocal(next as Record<PlatformTag, string>)
      setIsGenerating(false)
    }, 800)
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-primary" />
            Repurpose
          </CardTitle>
          <CardDescription>Generate multi-platform copies from a single source.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Copy className="h-5 w-5 text-primary" />
          Repurpose tool
        </CardTitle>
        <CardDescription>Generate multi-platform copies from a single source.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Source content</Label>
          <Textarea
            placeholder="Paste your article, post, or script here..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Target platforms
          </Label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(({ value, label }) => (
              <Button
                key={value}
                variant={selectedPlatforms.includes(value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => togglePlatform(value)}
                className="transition-transform duration-200 hover:scale-[1.02]"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <Button
          className="w-full transition-transform duration-200 hover:scale-[1.02]"
          onClick={handleGenerate}
          disabled={!source.trim() || selectedPlatforms.length === 0 || isGenerating}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating…' : 'Generate copies'}
        </Button>

        {Object.keys(generated).length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border animate-fade-in">
            <p className="text-sm font-medium text-foreground">Generated copies</p>
            {Object.entries(generated).map(([platform, text]) => (
              <div
                key={platform}
                className={cn(
                  'rounded-lg border border-border bg-card-secondary/50 p-4 transition-all duration-200 hover:border-primary/30'
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {PLATFORMS.find((p) => p.value === platform)?.label ?? platform}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 transition-transform duration-200 hover:scale-[1.02]"
                    onClick={() => {
                      navigator.clipboard.writeText(text).then(
                        () => toast.success('Copied to clipboard'),
                        () => toast.error('Failed to copy')
                      )
                    }}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">{text}</pre>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
