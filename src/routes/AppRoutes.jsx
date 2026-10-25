import { Route, Routes } from 'react-router'
import { AppLayout } from '../layouts/AppLayout.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'

/** Every page of the app and its URL. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
