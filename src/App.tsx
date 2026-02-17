import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/auth/Login'
import { SignupPage } from '@/pages/auth/Signup'
import { PasswordResetPage } from '@/pages/auth/PasswordReset'
import { EmailVerificationPage } from '@/pages/auth/EmailVerification'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<PasswordResetPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/500" element={<Error500Page />} />

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
  )
}

export default App
