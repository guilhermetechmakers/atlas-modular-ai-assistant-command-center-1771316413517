import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      toastOptions={{
        classNames: {
          toast: 'bg-card border border-border text-foreground',
          title: 'text-foreground',
          description: 'text-muted-foreground',
          success: 'border-atlas-cyan/50',
          error: 'border-destructive/50',
        },
      }}
    />
  )
}
