import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const signupSchema = loginSchema.extend({
  password: z.string().min(8, 'At least 8 characters'),
})

export type AuthMode = 'login' | 'signup'

export type AuthFormValues = z.infer<typeof loginSchema>

const getSchema = (mode: AuthMode) => (mode === 'signup' ? signupSchema : loginSchema)

export type AuthFormFields = { email: string; password: string }

/** When register/errors are provided, AuthForm renders only the fields (no form, no submit) for use inside a parent form. */
export interface AuthFormProps {
  mode: AuthMode
  onSubmit?: (data: { email: string; password: string }) => void
  isLoading?: boolean
  /** Use inside parent form: pass register and errors, and set hideSubmit to omit the submit button. */
  register?: UseFormRegister<AuthFormFields & { workspaceName?: string }>
  errors?: FieldErrors<AuthFormFields & { workspaceName?: string }>
  hideSubmit?: boolean
  className?: string
}

export function AuthForm({
  mode,
  onSubmit,
  isLoading = false,
  register: externalRegister,
  errors: externalErrors,
  hideSubmit = false,
  className,
}: AuthFormProps) {
  const schema = getSchema(mode)
  const internal = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const isEmbedded = Boolean(externalRegister && externalErrors)
  const register = isEmbedded ? externalRegister! : internal.register
  const errors = isEmbedded ? externalErrors! : internal.formState.errors

  const content = (
    <>
      <div className="space-y-2">
        <Label htmlFor="auth-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={cn('pl-9 transition-colors duration-200', errors.email && 'border-destructive focus-visible:ring-destructive')}
            {...register('email')}
          />
        </div>
        {errors.email?.message && (
          <p className="text-sm text-destructive animate-fade-in" role="alert">
            {String(errors.email.message)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="auth-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            id="auth-password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder="••••••••"
            className={cn('pl-9 transition-colors duration-200', errors.password && 'border-destructive focus-visible:ring-destructive')}
            {...register('password')}
          />
        </div>
        {errors.password?.message && (
          <p className="text-sm text-destructive animate-fade-in" role="alert">
            {String(errors.password.message)}
          </p>
        )}
      </div>
      {!hideSubmit && (
        <Button
          type="submit"
          className="w-full min-h-11 transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (mode === 'signup' ? 'Creating account…' : 'Signing in…') : mode === 'signup' ? 'Sign up' : 'Log in'}
        </Button>
      )}
    </>
  )

  if (isEmbedded) {
    return <div className={cn('space-y-4', className)}>{content}</div>
  }

  return (
    <form
      onSubmit={internal.handleSubmit((data) => onSubmit?.({ email: data.email, password: data.password }))}
      className={cn('space-y-4', className)}
      noValidate
    >
      {content}
    </form>
  )
}
