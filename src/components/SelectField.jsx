import { useId } from 'react'
import './FormField.css'

/** Label and a list of options. `options` are { value, label } pairs. */
export function SelectField({ label, options, placeholder, ...selectProps }) {
  const id = useId()

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} {...selectProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
