/**
 * Settings / Preferences types aligned with DB schema (settings_preferences table).
 * Table name in DB: settings_preferences (safe identifier; spec referenced settings_/_preferences).
 */

export interface SettingsPreferences {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface UserProfileForm {
  displayName: string
  email: string
  avatarUrl?: string
}

export interface ConnectedIntegration {
  id: string
  provider: 'github' | 'google_calendar'
  displayName: string
  connectedAt: string
  status: 'active' | 'expired'
}

export interface ApiKeyRecord {
  id: string
  name: string
  lastUsedAt?: string
  createdAt: string
}

export interface SessionRecord {
  id: string
  device?: string
  lastActive: string
  current: boolean
}
