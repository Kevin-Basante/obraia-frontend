import { Link } from 'react-router'
import './ProfileCard.css'

/** Account data of the signed-in user. */
export function ProfileCard({ user }) {
  return (
    <section className="card profile-card">
      <div className="profile-card__head">
        <span className="profile-card__avatar" aria-hidden="true">
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </span>
        <h2>My account</h2>
      </div>
      <dl className="profile-card__facts">
        <div>
          <dt>Name</dt>
          <dd>
            {user.firstName} {user.lastName}
          </dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{user.phone ?? 'Not added'}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{user.roles.join(', ')}</dd>
        </div>
      </dl>
      <Link to="/account" className="button-link">
        Edit my account
      </Link>
    </section>
  )
}
