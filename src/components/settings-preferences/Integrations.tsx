import { useState } from 'react'
import { Link2, Github, Calendar, Key, Check, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { ConnectedIntegration } from '@/types/settings-preferences'

export interface IntegrationsProps {
  integrations?: ConnectedIntegration[]
  isLoading?: boolean
  onConnect?: (provider: 'github' | 'google_calendar') => Promise<void>
  onDisconnect?: (id: string) => Promise<void>
}

const providerMeta: Record<string, { icon: typeof Github; label: string }> = {
  github: { icon: Github, label: 'GitHub' },
  google_calendar: { icon: Calendar, label: 'Google Calendar' },
}

export function Integrations({
  integrations = [],
  isLoading = false,
  onConnect,
  onDisconnect,
}: IntegrationsProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  const handleConnect = async (provider: 'github' | 'google_calendar') => {
    setConnecting(provider)
    try {
      await onConnect?.(provider)
      toast.success(`${providerMeta[provider].label} connected.`)
    } catch {
      toast.error(`Could not connect ${providerMeta[provider].label}. Try again.`)
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (id: string) => {
    setDisconnecting(id)
    try {
      await onDisconnect?.(id)
      toast.success('Integration disconnected.')
    } catch {
      toast.error('Failed to disconnect. Try again.')
    } finally {
      setDisconnecting(null)
    }
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Integrations
          </CardTitle>
          <CardDescription>GitHub, Google Calendar, OAuth tokens, connector management.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const githubConnected = integrations.some((i) => i.provider === 'github')
  const googleConnected = integrations.some((i) => i.provider === 'google_calendar')

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Integrations
        </CardTitle>
        <CardDescription>
          GitHub, Google Calendar, OAuth tokens, and connector management.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {(['github', 'google_calendar'] as const).map((provider) => {
            const meta = providerMeta[provider]
            const Icon = meta.icon
            const connected = provider === 'github' ? githubConnected : googleConnected
            const conn = integrations.find((i) => i.provider === provider)
            const isConnecting = connecting === provider
            const isDisconnecting = conn ? disconnecting === conn.id : false

            return (
              <div
                key={provider}
                className={cn(
                  'flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card-secondary/50 p-4',
                  'transition-all duration-200 hover:border-primary/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-foreground" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{meta.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {connected && conn
                        ? `Connected ${new Date(conn.connectedAt).toLocaleDateString()}`
                        : 'Connect to sync repos and activity'}
                    </p>
                  </div>
                  {connected && (
                    <Badge variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" />
                      Connected
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {connected && conn ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isDisconnecting}
                      onClick={() => handleDisconnect(conn.id)}
                      className="transition-transform duration-200 hover:scale-[1.02]"
                    >
                      <X className="mr-1.5 h-4 w-4" />
                      {isDisconnecting ? 'Disconnecting…' : 'Disconnect'}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={isConnecting}
                      onClick={() => handleConnect(provider)}
                      className="transition-transform duration-200 hover:scale-[1.02]"
                    >
                      <Key className="mr-1.5 h-4 w-4" />
                      {isConnecting ? 'Connecting…' : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          OAuth tokens are stored securely. Revoke access anytime from this page or from the provider app.
        </p>
      </CardContent>
    </Card>
  )
}
