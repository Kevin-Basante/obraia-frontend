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
  if (!profile.data) return <LoadingState title="Loading your account…" />

  return (
    <div className="workspace">
      <PageHeader
        title="My account"
        description="Your profile, your password and the deletion of your account."
        back={{ to: '/dashboard', label: 'Dashboard' }}
      />
      <section className="card">
        <h2>Profile</h2>
        <ProfileForm user={profile.data} onSave={save} />
      </section>
      <section className="card">
        <h2>Password</h2>
        <ChangePasswordForm onChanged={handlePasswordChanged} />
      </section>
      <section className="card account-page__danger">
        <h2>Delete my account</h2>
        <p className="muted">
          Your account and the projects you created are deleted. You will see the details before anything happens.
        </p>
        <Link to="/account/delete" className="button-link">
          Delete my account
        </Link>
      </section>
    </div>
  )
}
