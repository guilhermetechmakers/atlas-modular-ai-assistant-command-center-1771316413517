import { Github, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface OAuthButtonsProps {
  onGitHub?: () => void
  onGoogle?: () => void
  onSSO?: () => void
  isLoading?: boolean
  className?: string
}

export function OAuthButtons({ onGitHub, onGoogle, onSSO, isLoading = false, className }: OAuthButtonsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted-foreground">
          <span className="bg-card px-2">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="min-h-11 transition-all duration-200 hover:scale-[1.02] hover:shadow-card active:scale-[0.98]"
          onClick={onGitHub}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" aria-hidden />
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 transition-all duration-200 hover:scale-[1.02] hover:shadow-card active:scale-[0.98]"
          onClick={onGoogle}
          disabled={isLoading}
        >
          <Calendar className="mr-2 h-4 w-4" aria-hidden />
          Google
        </Button>
      </div>
      {/* Optional SSO placeholder */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground hover:text-foreground"
        onClick={onSSO}
        disabled
      >
        Use SSO (coming soon)
      </Button>
    </div>
  )
}
