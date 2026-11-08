import { Link } from 'react-router'
import './ProfileCard.css'
import { codeText, t } from '../i18n/i18n.js'

/** Account data of the signed-in user. */
export function ProfileCard({ user }) {
  return (
    <section className="card profile-card">
      <div className="profile-card__head">
        <span className="profile-card__avatar" aria-hidden="true">
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </span>
        <h2>{t('profileCard.title')}</h2>
      </div>
      <dl className="profile-card__facts">
        <div>
          <dt>{t('profileCard.name')}</dt>
          <dd>
            {user.firstName} {user.lastName}
          </dd>
        </div>
        <div>
          <dt>{t('profileCard.email')}</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>{t('profileCard.phone')}</dt>
          <dd>{user.phone ?? t('common.notAdded')}</dd>
        </div>
        <div>
          <dt>{t('profileCard.role')}</dt>
          <dd>{user.roles.map((role) => codeText('role', role)).join(', ')}</dd>
        </div>
      </dl>
      <Link to="/account" className="button-link">
        {t('profileCard.edit')}
      </Link>
    </section>
  )
}
