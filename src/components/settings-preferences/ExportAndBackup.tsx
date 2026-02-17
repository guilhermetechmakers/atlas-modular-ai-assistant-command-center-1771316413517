import { useState } from 'react'
import { Download, Database, FolderArchive } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface ExportAndBackupProps {
  isLoading?: boolean
  onExportWorkspace?: () => Promise<void>
  onBackupConfigChange?: (enabled: boolean) => Promise<void>
  backupEnabled?: boolean
}

export function ExportAndBackup({
  isLoading = false,
  onExportWorkspace,
  onBackupConfigChange,
  backupEnabled = false,
}: ExportAndBackupProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isSavingBackup, setIsSavingBackup] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExportWorkspace?.()
      toast.success('Workspace export started. You will receive the download when ready.')
    } catch {
      toast.error('Export failed. Try again later.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleBackupToggle = async (checked: boolean) => {
    setIsSavingBackup(true)
    try {
      await onBackupConfigChange?.(checked)
      toast.success(checked ? 'Backup enabled.' : 'Backup disabled.')
    } catch {
      toast.error('Could not update backup settings.')
    } finally {
      setIsSavingBackup(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export & backup
          </CardTitle>
          <CardDescription>DB backup config, export workspace data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Export & backup
        </CardTitle>
        <CardDescription>
          DB backup configuration and export workspace data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={cn(
            'rounded-lg border border-border bg-card-secondary/50 p-4 space-y-3',
            'transition-colors duration-200 hover:border-primary/30'
          )}
        >
          <div className="flex items-center gap-3">
            <FolderArchive className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Export workspace</p>
              <p className="text-sm text-muted-foreground">
                Download a bundle of your workspace data (projects, content, settings).
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isExporting}
            onClick={handleExport}
            className="gap-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Preparing…' : 'Export workspace'}
          </Button>
        </div>

        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4',
            'transition-colors duration-200 hover:border-primary/30'
          )}
        >
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <Label htmlFor="backup-toggle" className="font-medium text-foreground cursor-pointer">
                Database backup
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable automated DB backup (configurable in self-host / admin).
              </p>
            </div>
          </div>
          <Switch
            id="backup-toggle"
            checked={backupEnabled}
            onCheckedChange={handleBackupToggle}
            disabled={isSavingBackup}
            aria-label="Toggle database backup"
          />
        </div>
      </CardContent>
    </Card>
  )
}
