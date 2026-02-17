import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/auth/Login'
import { SignupPage } from '@/pages/auth/Signup'
import { PasswordResetPage } from '@/pages/auth/PasswordReset'
import { EmailVerificationPage } from '@/pages/auth/EmailVerification'
import LoginSignupPage from '@/pages/Login/Signup'
import { DashboardOverviewPage } from '@/pages/dashboard/Overview'
import { ProjectsPage } from '@/pages/dashboard/Projects'
import { ContentPipelinePage } from '@/pages/dashboard/ContentPipeline'
import { ResearchPage } from '@/pages/dashboard/Research'
import { PersonalPage } from '@/pages/dashboard/Personal'
import { FinancePage } from '@/pages/dashboard/Finance'
import { AgentBuilderPage } from '@/pages/dashboard/AgentBuilder'
import { SettingsPage } from '@/pages/dashboard/Settings'
import { AdminPage } from '@/pages/dashboard/Admin'
import { AuditPage } from '@/pages/dashboard/Audit'
import { AboutPage } from '@/pages/About'
import { PrivacyPolicyPage } from '@/pages/legal/PrivacyPolicy'
import { TermsPage } from '@/pages/legal/Terms'
import { NotFoundPage } from '@/pages/NotFound'
import { Error500Page } from '@/pages/Error500'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<PasswordResetPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/login-/-signup" element={<LoginSignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/500" element={<Error500Page />} />
        <Route path="/content-pipeline" element={<Navigate to="/dashboard/content" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverviewPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="content" element={<ContentPipelinePage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="personal" element={<PersonalPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="agents" element={<AgentBuilderPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="audit" element={<AuditPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
