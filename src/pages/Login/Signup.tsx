import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { AuthForm, type AuthMode } from '@/components/login-signup/AuthForm'
import { OAuthButtons } from '@/components/login-signup/OAuthButtons'
import { CreateWorkspaceFlow } from '@/components/login-signup/CreateWorkspaceFlow'
import { SSOAndMFACTA } from '@/components/login-signup/SSOAndMFACTA'
import { FooterLinks } from '@/components/login-signup/FooterLinks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const signupSchema = loginSchema.extend({
  password: z.string().min(8, 'At least 8 characters'),
  workspaceName: z.string().min(1, 'Workspace name is required').max(64, 'Max 64 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

export function LoginSignupPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')

  useEffect(() => {
    document.title = mode === 'signup' ? 'Sign up | Atlas' : 'Log in | Atlas'
    return () => {
      document.title = 'Atlas — Command Center'
    }
  }, [mode])
  const [isLoading, setIsLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', workspaceName: '' },
  })

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      toast.success('Signed in successfully')
      navigate('/dashboard')
    } catch {
      toast.error('Sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignupSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      toast.success('Account created. Please verify your email.')
      navigate('/verify-email')
    } catch {
      toast.error('Sign up failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-foreground hover:opacity-90 transition-opacity"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              A
            </span>
            Atlas
          </Link>
        </div>

        <Card className="shadow-card transition-shadow duration-300 hover:shadow-card-hover">
          <CardHeader className="space-y-1">
            <div className="flex rounded-lg border border-border bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={cn(
                  'flex-1 rounded-md py-2 text-sm font-medium transition-all duration-200',
                  mode === 'login'
                    ? 'bg-background text-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={mode === 'login'}
                aria-label="Switch to log in"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={cn(
                  'flex-1 rounded-md py-2 text-sm font-medium transition-all duration-200',
                  mode === 'signup'
                    ? 'bg-background text-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={mode === 'signup'}
                aria-label="Switch to sign up"
              >
                Sign up
              </button>
            </div>
            <CardTitle className="text-xl">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login'
                ? 'Use your email or sign in with a provider.'
                : 'Set up your workspace and connect integrations next.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === 'login' ? (
              <>
                <AuthForm
                  mode="login"
                  onSubmit={onLoginSubmit}
                  isLoading={isLoading}
                />
                <div className="text-sm text-center">
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Forgot password?
                  </Link>
                </div>
              </>
            ) : (
              <form
                onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                className="space-y-4"
                noValidate
              >
                <AuthForm
                  mode="signup"
                  register={signupForm.register}
                  errors={signupForm.formState.errors}
                  hideSubmit
                />
                <CreateWorkspaceFlow
                  register={signupForm.register}
                  errors={signupForm.formState.errors}
                />
                <Button
                  type="submit"
                  className="w-full min-h-11"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account…' : 'Sign up'}
                </Button>
              </form>
            )}

            <OAuthButtons isLoading={isLoading} />

            <SSOAndMFACTA
              twoFactorEnabled={twoFactorEnabled}
              onTwoFactorChange={setTwoFactorEnabled}
              twoFactorDisabled
            />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary font-medium hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </p>

        <FooterLinks className="mt-8" />
      </div>
    </div>
  )
}

export default LoginSignupPage
