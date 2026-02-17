import { useState } from 'react'
import { Shield, Key, Smartphone, Monitor, LogOut } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { ApiKeyRecord, SessionRecord } from '@/types/settings-preferences'

export interface SecurityProps {
  apiKeys?: ApiKeyRecord[]
  sessions?: SessionRecord[]
  twoFactorEnabled?: boolean
  isLoading?: boolean
  onChangePassword?: (current: string, newPassword: string) => Promise<void>
  onToggle2FA?: (enabled: boolean) => Promise<void>
  onRevokeApiKey?: (id: string) => Promise<void>
  onRevokeSession?: (id: string) => Promise<void>
}

export function Security({
  apiKeys = [],
  sessions = [],
  twoFactorEnabled = false,
  isLoading = false,
  onChangePassword,
  onToggle2FA,
  onRevokeApiKey,
  onRevokeSession,
}: SecurityProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isToggling2FA, setIsToggling2FA] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setIsChangingPassword(true)
    try {
      await onChangePassword?.(currentPassword, newPassword)
      toast.success('Password updated.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch {
      toast.error('Failed to change password. Check current password.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleToggle2FA = async () => {
    setIsToggling2FA(true)
    try {
      await onToggle2FA?.(!twoFactorEnabled)
      toast.success(twoFactorEnabled ? '2FA disabled.' : '2FA enabled.')
    } catch {
      toast.error('Could not update 2FA. Try again.')
    } finally {
      setIsToggling2FA(false)
    }
  }

  const handleRevokeKey = async (id: string) => {
    try {
      await onRevokeApiKey?.(id)
      toast.success('API key revoked.')
    } catch {
      toast.error('Failed to revoke key.')
    }
  }

  const handleRevokeSession = async (id: string) => {
    try {
      await onRevokeSession?.(id)
      toast.success('Session ended.')
    } catch {
      toast.error('Failed to end session.')
    }
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>Password, 2FA, API keys, session management.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security
        </CardTitle>
        <CardDescription>
          Password change, 2FA, API keys, and session management.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Password</h4>
          {!showPasswordForm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordForm(true)}
              className="transition-transform duration-200 hover:scale-[1.02]"
            >
              Change password
            </Button>
          ) : (
            <form
              onSubmit={handlePasswordSubmit}
              className="rounded-lg border border-border bg-card-secondary/50 p-4 space-y-3 animate-fade-in"
            >
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? 'Updating…' : 'Update password'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* 2FA */}
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Two-factor authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security.</p>
            </div>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={isToggling2FA}
            aria-label="Toggle two-factor authentication"
          />
        </section>

        {/* API keys */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Key className="h-4 w-4" />
            API keys
          </h4>
          {apiKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground">No API keys yet. Create one from the API section.</p>
          ) : (
            <ul className="space-y-2">
              {apiKeys.map((key) => (
                <li
                  key={key.id}
                  className={cn(
                    'flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card-secondary/50 px-3 py-2',
                    'transition-colors duration-200 hover:border-primary/30'
                  )}
                >
                  <span className="font-mono text-sm">{key.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {key.lastUsedAt && <span>Last used {new Date(key.lastUsedAt).toLocaleDateString()}</span>}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:text-destructive"
                      onClick={() => handleRevokeKey(key.id)}
                    >
                      Revoke
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Sessions */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Active sessions
          </h4>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No other sessions.</p>
          ) : (
            <ul className="space-y-2">
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className={cn(
                    'flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card-secondary/50 px-3 py-2',
                    'transition-colors duration-200 hover:border-primary/30'
                  )}
                >
                  <span className="text-sm">{session.device ?? 'Unknown device'}</span>
                  <div className="flex items-center gap-2">
                    {session.current && (
                      <span className="text-xs text-muted-foreground">This device</span>
                    )}
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-muted-foreground"
                        onClick={() => handleRevokeSession(session.id)}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        End session
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  )
}
