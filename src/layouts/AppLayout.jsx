import { Outlet } from 'react-router'
import { AppHeader } from '../components/AppHeader.jsx'
import { SiteFooter } from '../components/SiteFooter.jsx'
import './AppLayout.css'

/** Frame of every page: header, the current page and footer. */
export function AppLayout() {
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
