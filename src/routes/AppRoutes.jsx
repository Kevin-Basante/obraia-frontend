import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '../layouts/AppLayout.jsx'
import { CatalogLayout } from '../layouts/CatalogLayout.jsx'
import { CheckEmailPage } from '../pages/CheckEmailPage.jsx'
import { ConfirmDeletionPage } from '../pages/ConfirmDeletionPage.jsx'
import { DashboardPage } from '../pages/DashboardPage.jsx'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { ResetPasswordPage } from '../pages/ResetPasswordPage.jsx'
import { SiteManagersPage } from '../pages/SiteManagersPage.jsx'
import { VerifyEmailPage } from '../pages/VerifyEmailPage.jsx'
import { CitiesPage } from '../pages/catalog/CitiesPage.jsx'
import { MaterialsPage } from '../pages/catalog/MaterialsPage.jsx'
import { ProjectTypeDetailPage } from '../pages/catalog/ProjectTypeDetailPage.jsx'
import { ProjectTypesPage } from '../pages/catalog/ProjectTypesPage.jsx'
import { BlueprintViewPage } from '../pages/projects/BlueprintViewPage.jsx'
import { BlueprintsPage } from '../pages/projects/BlueprintsPage.jsx'
import { DeleteProjectPage } from '../pages/projects/DeleteProjectPage.jsx'
import { EditProjectPage } from '../pages/projects/EditProjectPage.jsx'
import { NewProjectPage } from '../pages/projects/NewProjectPage.jsx'
import { ProjectDetailPage } from '../pages/projects/ProjectDetailPage.jsx'
import { ProjectsPage } from '../pages/projects/ProjectsPage.jsx'
import { GuestOnly } from './GuestOnly.jsx'
import { RequireAccount } from './RequireAccount.jsx'
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
        <Route path="confirm-deletion" element={<ConfirmDeletionPage />} />

        {/* Public: guests and signed-out visitors can browse the catalog. */}
        <Route path="catalog" element={<CatalogLayout />}>
          <Route index element={<Navigate to="materials" replace />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="project-types" element={<ProjectTypesPage />} />
          <Route path="project-types/:id" element={<ProjectTypeDetailPage />} />
          <Route path="cities" element={<CitiesPage />} />
        </Route>

        <Route element={<RequireSession />}>
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Projects are saved in the account, so guests see an invitation to register. */}
          <Route element={<RequireAccount />}>
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<NewProjectPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="projects/:id/edit" element={<EditProjectPage />} />
            <Route path="projects/:id/delete" element={<DeleteProjectPage />} />
            <Route path="projects/:id/blueprints" element={<BlueprintsPage />} />
            <Route path="projects/:id/blueprints/:blueprintId" element={<BlueprintViewPage />} />
            <Route path="site-managers" element={<SiteManagersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
