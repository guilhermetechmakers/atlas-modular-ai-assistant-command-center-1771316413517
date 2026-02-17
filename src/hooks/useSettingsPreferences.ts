import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsPreferencesApi } from '@/api/settings-preferences'
import type { UserProfileForm } from '@/types/settings-preferences'

export const settingsPreferencesKeys = {
  all: ['settings-preferences'] as const,
  profile: () => [...settingsPreferencesKeys.all, 'profile'] as const,
  integrations: () => [...settingsPreferencesKeys.all, 'integrations'] as const,
  apiKeys: () => [...settingsPreferencesKeys.all, 'api-keys'] as const,
  sessions: () => [...settingsPreferencesKeys.all, 'sessions'] as const,
}

export function useSettingsProfile() {
  return useQuery({
    queryKey: settingsPreferencesKeys.profile(),
    queryFn: () => settingsPreferencesApi.getProfile(),
  })
}

export function useSettingsProfileUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserProfileForm) => settingsPreferencesApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsPreferencesKeys.profile() })
    },
  })
}

export function useSettingsIntegrations() {
  return useQuery({
    queryKey: settingsPreferencesKeys.integrations(),
    queryFn: () => settingsPreferencesApi.getIntegrations(),
  })
}

export function useSettingsApiKeys() {
  return useQuery({
    queryKey: settingsPreferencesKeys.apiKeys(),
    queryFn: () => settingsPreferencesApi.getApiKeys(),
  })
}

export function useSettingsSessions() {
  return useQuery({
    queryKey: settingsPreferencesKeys.sessions(),
    queryFn: () => settingsPreferencesApi.getSessions(),
  })
}

export function useSettingsPasswordChange() {
  return useMutation({
    mutationFn: ({ current, newPassword }: { current: string; newPassword: string }) =>
      settingsPreferencesApi.changePassword(current, newPassword),
  })
}
