import { Outlet } from 'react-router'
import { AppHeader } from '../components/AppHeader.jsx'
import { SiteFooter } from '../components/SiteFooter.jsx'
import { useAiWakeUp } from '../hooks/useAiWakeUp.js'
import './AppLayout.css'

/**
 * Frame of every page: header, the current page and footer. It also keeps
 * the AI awake while someone signed in uses the site.
 */
export function AppLayout() {
  useAiWakeUp()

  return (
    <div className="app-layout">
      <AppHeader />
      <main className="page">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
