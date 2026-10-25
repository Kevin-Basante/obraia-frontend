import './FormAlert.css'

/** Message above or below a form: an error from the backend or a confirmation. */
export function FormAlert({ type = 'error', children }) {
  if (!children) return null
  return (
    <p className={`form-alert form-alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}
