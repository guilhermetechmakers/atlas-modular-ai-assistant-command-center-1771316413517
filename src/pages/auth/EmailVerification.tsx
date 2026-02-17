import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { EmailVerificationStatus } from '@/types/login-signup'

export function EmailVerificationPage() {
  useEffect(() => {
    document.title = 'Verify your email | Atlas'
    return () => {
      document.title = 'Atlas — Command Center'
    }
  }, [])
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  /** In a real app this would come from auth/session. */
  const [status, setStatus] = useState<EmailVerificationStatus>('pending')

  const resend = async () => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      setSent(true)
      setStatus('pending')
      toast.success('Verification email sent. Check your inbox.')
    } catch {
      toast.error('Failed to send. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
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
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary mx-auto">
              <Mail className="h-6 w-6" aria-hidden />
            </div>
            <CardTitle className="text-center">Verify your email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a verification link to your email. Click the link to activate your account. Required for OAuth and secure access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status display */}
            <div
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                status === 'verified' &&
                  'border-atlas-cyan/30 bg-atlas-cyan/10 text-atlas-cyan',
                status === 'pending' &&
                  'border-primary/30 bg-primary/10 text-primary',
                status === 'unknown' &&
                  'border-muted bg-muted/30 text-muted-foreground'
              )}
              role="status"
              aria-live="polite"
            >
              {status === 'verified' ? (
                <>
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Email verified. You can use all features.</span>
                </>
              ) : status === 'pending' ? (
                <>
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Verification pending. Check your inbox and click the link.</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>Verification status unknown. Resend to get a new link.</span>
                </>
              )}
            </div>

            {sent && (
              <div className="flex items-center gap-2 rounded-lg border border-atlas-cyan/30 bg-atlas-cyan/10 px-3 py-2 text-sm text-atlas-cyan">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>New verification email sent. Check your inbox.</span>
              </div>
            )}
            <p className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check spam or request a new link (rate limited).
            </p>
            <Button
              variant="outline"
              className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={resend}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-[spin]" />
                  Sending…
                </>
              ) : (
                'Resend verification email'
              )}
            </Button>
            <p className="text-center text-sm">
              <Link
                to="/login-/-signup"
                className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Back to log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
