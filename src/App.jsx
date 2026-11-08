import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthProvider.jsx'
import { LanguageProvider } from './context/LanguageProvider.jsx'
import { AppRoutes } from './routes/AppRoutes.jsx'

/** Root of the app: the language, the router and the session wrap every page. */
function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
