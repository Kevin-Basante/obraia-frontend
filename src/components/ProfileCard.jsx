import './ProfileCard.css'

/** Account data of the signed-in user. */
export function ProfileCard({ user }) {
  return (
    <section className="card profile-card">
      <h2>My account</h2>
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
    </section>
  )
}
