import { useCallback } from 'react'
import { Link } from 'react-router'
import { ChangePasswordForm } from '../components/account/ChangePasswordForm.jsx'
import { ProfileForm } from '../components/account/ProfileForm.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { useApiData } from '../hooks/useApiData.js'
import { useAuth } from '../hooks/useAuth.js'
import { getCurrentUser, updateProfile } from '../services/userService.js'
import './AccountPage.css'
import { t } from '../i18n/i18n.js'

/** Profile, password and the way to delete the account of the signed-in user. */
export function AccountPage() {
  const { updateUser, signOut } = useAuth()
  const profile = useApiData((signal) => getCurrentUser({ signal }), [])

  // The header shows the first name, so the session gets the saved profile too.
  const save = useCallback(
    async (request) => {
      const user = await updateProfile(request)
      updateUser(user)
      return user
    },
    [updateUser],
  )

  // The backend closed every session, so the user signs in again with the new password.
  // Signing out sends the user to the sign-in page, which shows the message.
  function handlePasswordChanged(message) {
    signOut(message)
  }

  if (profile.status === 'error') return <ErrorState error={profile.error} onRetry={profile.retry} />
  if (!profile.data) return <LoadingState title={t('accountPage.loadingYourAccount')} />

  return (
    <div className="workspace">
      <PageHeader
        title={t('accountPage.myAccount')}
        description={t('accountPage.yourProfileYourPasswordAnd')}
        back={{ to: '/dashboard', label: t('accountPage.dashboard') }}
      />
      <section className="card">
        <h2>{t('accountPage.profile')}</h2>
        <ProfileForm user={profile.data} onSave={save} />
      </section>
      <section className="card">
        <h2>{t('accountPage.password')}</h2>
        <ChangePasswordForm onChanged={handlePasswordChanged} />
      </section>
      <section className="card account-page__danger">
        <h2>{t('accountPage.deleteMyAccount')}</h2>
        <p className="muted">{t('accountPage.yourAccountAndTheProjects')}</p>
        <Link to="/account/delete" className="button-link">
          {t('accountPage.deleteMyAccount')}
        </Link>
      </section>
    </div>
  )
}
