import { Route, Routes } from 'react-router'
import { AppLayout } from '../layouts/AppLayout.jsx'
import { CheckEmailPage } from '../pages/CheckEmailPage.jsx'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { ResetPasswordPage } from '../pages/ResetPasswordPage.jsx'
import { VerifyEmailPage } from '../pages/VerifyEmailPage.jsx'
import { GuestOnly } from './GuestOnly.jsx'

/** Every page of the app and its URL. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />

        <Route element={<GuestOnly />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Opened from the links sent by email. */}
        <Route path="check-email" element={<CheckEmailPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
