/** Login/Signup record (maps to login_/_signup table). */
export interface LoginSignup {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export type EmailVerificationStatus = 'pending' | 'verified' | 'unknown'
