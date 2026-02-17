import { useState, useRef } from 'react'
import { Image, FileText, List, FolderOpen, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ContentAsset } from '@/types/content-pipeline'

const ASSET_TYPE_LABELS: Record<ContentAsset['type'], string> = {
  thumbnail: 'Thumbnail',
  script: 'Script',
  outline: 'Outline',
  other: 'Other',
}

const ASSET_ICONS: Record<ContentAsset['type'], typeof Image> = {
  thumbnail: Image,
  script: FileText,
  outline: List,
  other: FolderOpen,
}

export interface AssetManagerProps {
  assets: ContentAsset[]
  isLoading?: boolean
  onUpload?: (files: File[], type: ContentAsset['type']) => void
  onDelete?: (id: string) => void
}

export function AssetManager({
  assets,
  isLoading = false,
  onUpload,
  onDelete,
}: AssetManagerProps) {
  const [filterType, setFilterType] = useState<ContentAsset['type'] | 'all'>('all')
  const [uploadType, setUploadType] = useState<ContentAsset['type']>('thumbnail')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = filterType === 'all' ? assets : assets.filter((a) => a.type === filterType)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length && onUpload) onUpload(files, uploadType)
    e.target.value = ''
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            Assets
          </CardTitle>
          <CardDescription>Upload and organize thumbnails, scripts, outlines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            Asset manager
          </CardTitle>
          <CardDescription>Upload and organize thumbnails, scripts, outlines.</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Upload as:</span>
          {(['thumbnail', 'script', 'outline', 'other'] as const).map((t) => (
            <Button
              key={t}
              variant={uploadType === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadType(t)}
              className="transition-transform duration-200 hover:scale-[1.02]"
            >
              {ASSET_TYPE_LABELS[t]}
            </Button>
          ))}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'thumbnail', 'script', 'outline', 'other'] as const).map((t) => (
            <Button
              key={t}
              variant={filterType === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(t)}
            >
              {t === 'all' ? 'All' : ASSET_TYPE_LABELS[t]}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-10 text-center text-muted-foreground">
            <Upload className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-2">No assets yet.</p>
            <p className="text-sm">Upload thumbnails, scripts, or outlines to get started.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload files
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((asset) => {
              const Icon = ASSET_ICONS[asset.type]
              return (
                <li
                  key={asset.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border border-border p-3',
                    'transition-all duration-200 hover:border-primary/30 hover:shadow-sm'
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{asset.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">
                        {ASSET_TYPE_LABELS[asset.type]}
                      </Badge>
                      {asset.size != null && (
                        <span className="text-xs text-muted-foreground">
                          {(asset.size / 1024).toFixed(1)} KB
                        </span>
                      )}
                    </div>
                  </div>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(asset.id)}
                    >
                      Remove
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
