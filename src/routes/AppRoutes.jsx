import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '../layouts/AppLayout.jsx'
import { CatalogLayout } from '../layouts/CatalogLayout.jsx'
import { CheckEmailPage } from '../pages/CheckEmailPage.jsx'
import { DashboardPage } from '../pages/DashboardPage.jsx'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { ResetPasswordPage } from '../pages/ResetPasswordPage.jsx'
import { VerifyEmailPage } from '../pages/VerifyEmailPage.jsx'
import { CitiesPage } from '../pages/catalog/CitiesPage.jsx'
import { MaterialsPage } from '../pages/catalog/MaterialsPage.jsx'
import { GuestOnly } from './GuestOnly.jsx'
import { RequireSession } from './RequireSession.jsx'

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

        {/* Public: guests and signed-out visitors can browse the catalog. */}
        <Route path="catalog" element={<CatalogLayout />}>
          <Route index element={<Navigate to="materials" replace />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="cities" element={<CitiesPage />} />
        </Route>

        <Route element={<RequireSession />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
