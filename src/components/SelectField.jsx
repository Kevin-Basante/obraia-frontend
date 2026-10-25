import { useId } from 'react'
import './FormField.css'

/** Label, a list of options and an optional error. `options` are { value, label } pairs. */
export function SelectField({ label, options, placeholder, error, ...selectProps }) {
  const id = useId()
  const messageId = `${id}-message`

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
        {...selectProps}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={messageId} className="form-field__error">
          {error}
        </p>
      )}
    </div>
  )
}
