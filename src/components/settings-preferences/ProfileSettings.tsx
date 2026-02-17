import { useState, useRef } from 'react'
import { User, Mail, Camera } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { UserProfileForm } from '@/types/settings-preferences'

export interface ProfileSettingsProps {
  profile?: UserProfileForm | null
  isLoading?: boolean
  onSave?: (data: UserProfileForm) => Promise<void>
}

const defaultProfile: UserProfileForm = {
  displayName: '',
  email: '',
  avatarUrl: '',
}

export function ProfileSettings({
  profile,
  isLoading = false,
  onSave,
}: ProfileSettingsProps) {
  const [form, setForm] = useState<UserProfileForm>(profile ?? defaultProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatarUrl ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (field: keyof UserProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WebP).')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
    setForm((prev) => ({ ...prev, avatarUrl: file.name }))
    toast.success('Avatar selected. Save to apply.')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave?.(form)
      toast.success('Profile updated.')
    } catch {
      toast.error('Failed to save profile. Try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const initials = form.displayName
    ? form.displayName
        .trim()
        .split(/\s+/)
        .map((s) => s[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>Name, email, and avatar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const isEmptyProfile = !profile?.displayName?.trim() && !profile?.email?.trim()

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Profile settings
        </CardTitle>
        <CardDescription>
          {isEmptyProfile
            ? 'Complete your profile so your workspace shows your name and avatar.'
            : 'Update your name, email, and avatar.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-hidden
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              className={cn(
                'flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted text-2xl font-semibold text-muted-foreground',
                'transition-all duration-200 hover:border-primary/50 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label="Change avatar"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </button>
            <div className="flex flex-1 flex-col gap-2 sm:pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAvatarClick}
                className="w-fit transition-transform duration-200 hover:scale-[1.02]"
              >
                <Camera className="mr-2 h-4 w-4" />
                Upload avatar
              </Button>
              <p className="text-xs text-muted-foreground">JPEG, PNG or WebP. Max 2MB.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-name" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Display name
            </Label>
            <Input
              id="profile-name"
              placeholder="Your name"
              value={form.displayName}
              onChange={handleChange('displayName')}
              className="transition-colors duration-200 focus:ring-2 focus:ring-ring focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email" className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Email
            </Label>
            <Input
              id="profile-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              className="transition-colors duration-200 focus:ring-2 focus:ring-ring focus-visible:outline-none"
            />
          </div>

          <Button type="submit" disabled={isSaving} className="transition-transform duration-200 hover:scale-[1.02]">
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
