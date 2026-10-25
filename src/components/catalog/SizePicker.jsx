import './SizePicker.css'

const SIZES = [
  { value: 'small', label: 'Small', detail: 'up to 120 m²' },
  { value: 'large', label: 'Large', detail: 'more than 120 m²' },
]

/** Two options for the project size. Disabled while a built area decides it. */
export function SizePicker({ value, onChange, disabled }) {
  return (
    <fieldset className="size-picker" disabled={disabled}>
      <legend>Project size</legend>
      {SIZES.map((size) => (
        <label key={size.value} className="size-picker__option">
          <input
            type="radio"
            name="size"
            value={size.value}
            checked={value === size.value}
            onChange={() => onChange(size.value)}
          />
          <span>
            {size.label} <span className="muted">({size.detail})</span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}
