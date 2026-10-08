import { AppHeader } from './components/AppHeader.jsx'
import { ErrorState } from './components/ErrorState.jsx'
import { HelloCard } from './components/HelloCard.jsx'
import { LoadingState } from './components/LoadingState.jsx'
import { useHello } from './hooks/useHello.js'

function App() {
  const { status, data, error, retry } = useHello()

  return (
    <main className="page">
      <AppHeader />
      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState error={error} onRetry={retry} />}
      {status === 'success' && <HelloCard data={data} />}
    </main>
  )
}

export default App
