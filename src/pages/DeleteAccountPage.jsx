import { AccountDeletionImpact } from '../components/account/AccountDeletionImpact.jsx'
import { DeleteAccountForm } from '../components/account/DeleteAccountForm.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { useApiData } from '../hooks/useApiData.js'
import { getAccountDeletionImpact } from '../services/accountService.js'

/**
 * First step of the account deletion: shows the warnings, asks for the
 * password and sends the email. Nothing is deleted until the link is opened.
 */
export function DeleteAccountPage() {
  const impact = useApiData((signal) => getAccountDeletionImpact({ signal }), [])

  if (impact.status === 'error') return <ErrorState error={impact.error} onRetry={impact.retry} />
  if (!impact.data) return <LoadingState title="Checking your projects…" />

  return (
    <div className="workspace">
      <PageHeader title="Delete my account" back={{ to: '/account', label: 'My account' }} />
      <AccountDeletionImpact impact={impact.data} />
      <DeleteAccountForm />
    </div>
  )
}
