import { useId } from 'react'
import './FormField.css'

/** Label, input and error message, linked so screen readers announce the error. */
export function FormField({ label, error, hint, ...inputProps }) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />
      {message && (
        <p id={messageId} className={error ? 'form-field__error' : 'form-field__hint'}>
          {message}
        </p>
      )}
    </div>
  )
}
