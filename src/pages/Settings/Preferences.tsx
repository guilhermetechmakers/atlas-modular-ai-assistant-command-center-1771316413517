import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Link2, Shield, CreditCard, Download, BookOpen, RefreshCw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ProfileSettings,
  Integrations,
  Security,
  BillingAndPlan,
  ExportAndBackup,
  SelfHosting,
} from '@/components/settings-preferences'
import { useQueryClient } from '@tanstack/react-query'
import {
  useSettingsProfile,
  useSettingsProfileUpdate,
  useSettingsIntegrations,
  useSettingsApiKeys,
  useSettingsSessions,
  settingsPreferencesKeys,
} from '@/hooks/useSettingsPreferences'
import { settingsPreferencesApi } from '@/api/settings-preferences'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserProfileForm } from '@/types/settings-preferences'

export function PreferencesPage() {
  const queryClient = useQueryClient()
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useSettingsProfile()

  useEffect(() => {
    document.title = 'Settings & Preferences | Atlas'
    return () => {
      document.title = 'Atlas'
    }
  }, [])
  const profileUpdate = useSettingsProfileUpdate()
  const { data: integrations = [], isLoading: integrationsLoading } = useSettingsIntegrations()
  const { data: apiKeys = [], isLoading: apiKeysLoading } = useSettingsApiKeys()
  const { data: sessions = [], isLoading: sessionsLoading } = useSettingsSessions()

  const profileForm: UserProfileForm | null = profile
    ? {
        displayName: profile.displayName ?? '',
        email: profile.email ?? '',
        avatarUrl: profile.avatarUrl,
      }
    : null

  const handleSaveProfile = async (data: UserProfileForm) => {
    await profileUpdate.mutateAsync(data)
  }

  const handleConnect = async (provider: 'github' | 'google_calendar') => {
    await settingsPreferencesApi.connectIntegration(provider)
    queryClient.invalidateQueries({ queryKey: settingsPreferencesKeys.integrations() })
  }

  const handleDisconnect = async (id: string) => {
    await settingsPreferencesApi.disconnectIntegration(id)
    queryClient.invalidateQueries({ queryKey: settingsPreferencesKeys.integrations() })
  }

  const handleChangePassword = async (current: string, newPassword: string) => {
    await settingsPreferencesApi.changePassword(current, newPassword)
  }

  const handleToggle2FA = async () => {
    toast.info('2FA configuration is available when your backend supports it.')
  }

  const handleExportWorkspace = async () => {
    await settingsPreferencesApi.exportWorkspace()
  }

  return (
    <div className="space-y-6 animate-fade-in-up motion-reduce:animate-none">
      <div>
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-2">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <span className="mx-2" aria-hidden>/</span>
          <span className="text-foreground">Settings</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Preferences
        </h1>
        <p className="mt-1 text-muted-foreground">
          Account details, avatar, workspace membership, integrations, security, and backup.
        </p>
      </div>

      {profileError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load profile</CardTitle>
            <CardDescription>
              Something went wrong loading your profile. You can retry or continue to other tabs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => refetchProfile()}
              className="gap-2 transition-transform duration-200 hover:scale-[1.02]"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile" className="w-full" aria-label="Settings sections">
        <TabsList className="flex h-auto flex-wrap gap-1 border-border bg-card-secondary p-2" role="tablist" aria-label="Preferences sections">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Link2 className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2">
            <Download className="h-4 w-4" />
            Export & backup
          </TabsTrigger>
          <TabsTrigger value="selfhost" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Self-hosting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSettings
            key={profileForm?.email ?? 'empty'}
            profile={profileForm}
            isLoading={profileLoading}
            onSave={handleSaveProfile}
          />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Integrations
            integrations={integrations}
            isLoading={integrationsLoading}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Security
            apiKeys={apiKeys}
            sessions={sessions}
            isLoading={apiKeysLoading || sessionsLoading}
            twoFactorEnabled={false}
            onChangePassword={handleChangePassword}
            onToggle2FA={handleToggle2FA}
            onRevokeApiKey={(id) =>
              settingsPreferencesApi.revokeApiKey(id).then(() =>
                queryClient.invalidateQueries({ queryKey: settingsPreferencesKeys.apiKeys() })
              )
            }
            onRevokeSession={(id) =>
              settingsPreferencesApi.revokeSession(id).then(() =>
                queryClient.invalidateQueries({ queryKey: settingsPreferencesKeys.sessions() })
              )
            }
          />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <BillingAndPlan planName="Self-hosted" isSaaS={false} />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ExportAndBackup onExportWorkspace={handleExportWorkspace} />
        </TabsContent>

        <TabsContent value="selfhost" className="mt-6">
          <SelfHosting onCheckUpdates={() => toast.info('Check your Docker or deployment docs for updates.')} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PreferencesPage
