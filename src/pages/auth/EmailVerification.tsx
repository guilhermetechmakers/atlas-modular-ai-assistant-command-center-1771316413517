import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function EmailVerificationPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const resend = async () => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">A</span>
            Atlas
          </Link>
        </div>
        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary mx-auto">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="text-center">Verify your email</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification link to your email. Click the link to activate your account. Required for OAuth and secure access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sent && (
              <div className="flex items-center gap-2 rounded-lg border border-atlas-cyan/30 bg-atlas-cyan/10 px-3 py-2 text-sm text-atlas-cyan">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>New verification email sent. Check your inbox.</span>
              </div>
            )}
            <p className="text-center text-sm text-muted-foreground">
              Didn't receive the email? Check spam or request a new link (rate limited).
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={resend}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Resend verification email'}
            </Button>
            <p className="text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">Back to log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
