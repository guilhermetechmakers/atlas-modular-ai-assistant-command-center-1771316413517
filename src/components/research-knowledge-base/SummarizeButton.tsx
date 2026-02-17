import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface SummarizeButtonProps {
  disabled?: boolean
  onSummarize?: (selection?: string) => void
  selection?: string
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Runs AI to create a summarized note with citations.
 * MVP: triggers callback and shows toast; connect to Edge Function for real AI.
 */
export function SummarizeButton({
  disabled = false,
  onSummarize,
  selection,
  className,
  variant = 'outline',
  size = 'sm',
}: SummarizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      onSummarize?.(selection)
      toast.info(
        selection
          ? 'Summarizing selection… (connect backend for AI)'
          : 'Summarizing note… (connect backend for AI)'
      )
      await new Promise((r) => setTimeout(r, 800))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={cn(
        'transition-transform duration-200 hover:scale-[1.02]',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Sparkles className="h-4 w-4" aria-hidden />
      )}
      <span className="ml-2">Summarize</span>
    </Button>
  )
}
