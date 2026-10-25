import { useState } from 'react'
import { FormField } from './FormField.jsx'
import './PasswordField.css'

/** Password input with a button to show or hide what was typed. */
export function PasswordField(props) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <FormField {...props} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        className="password-field__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
