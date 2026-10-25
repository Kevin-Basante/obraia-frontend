import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthProvider.jsx'
import { AppRoutes } from './routes/AppRoutes.jsx'

/** Root of the app: the router and the session wrap every page. */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
