import { api } from '@/lib/api'
import type {
  UserProfileForm,
  ConnectedIntegration,
  ApiKeyRecord,
  SessionRecord,
} from '@/types/settings-preferences'

const PREFERENCES_BASE = '/settings/preferences'

export const settingsPreferencesApi = {
  getProfile: () =>
    api.get<UserProfileForm>(`${PREFERENCES_BASE}/profile`).catch(() => null),
  updateProfile: (data: UserProfileForm) =>
    api.patch<UserProfileForm>(`${PREFERENCES_BASE}/profile`, data),

  getIntegrations: () =>
    api.get<ConnectedIntegration[]>(`${PREFERENCES_BASE}/integrations`).catch(() => []),
  connectIntegration: (provider: 'github' | 'google_calendar') =>
    api.post<ConnectedIntegration>(`${PREFERENCES_BASE}/integrations/connect`, { provider }),
  disconnectIntegration: (id: string) =>
    api.delete<void>(`${PREFERENCES_BASE}/integrations/${id}`),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<void>(`${PREFERENCES_BASE}/security/password`, {
      current_password: currentPassword,
      new_password: newPassword,
    }),
  getApiKeys: () =>
    api.get<ApiKeyRecord[]>(`${PREFERENCES_BASE}/security/api-keys`).catch(() => []),
  revokeApiKey: (id: string) =>
    api.delete<void>(`${PREFERENCES_BASE}/security/api-keys/${id}`),
  getSessions: () =>
    api.get<SessionRecord[]>(`${PREFERENCES_BASE}/security/sessions`).catch(() => []),
  revokeSession: (id: string) =>
    api.delete<void>(`${PREFERENCES_BASE}/security/sessions/${id}`),

  exportWorkspace: () =>
    api.post<{ job_id: string }>(`${PREFERENCES_BASE}/export`),
}
