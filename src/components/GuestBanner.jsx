import { Link } from 'react-router'
import './GuestBanner.css'

/** Reminds guests that nothing is saved and invites them to create an account. */
export function GuestBanner() {
  return (
    <aside className="guest-banner" role="note">
      <p>
        You are using ObraIA as a guest: you can try the tools, but nothing is saved.{' '}
        <Link to="/register">Create an account</Link> to keep your projects.
      </p>
    </aside>
  )
}
