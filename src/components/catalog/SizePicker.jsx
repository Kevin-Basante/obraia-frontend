import './SizePicker.css'
import { t } from '../../i18n/i18n.js'

// Read in each render, so the texts follow the language.
function sizes() {
  return [
    { value: 'small', label: t('sizePicker.small'), detail: t('sizePicker.upTo120M') },
    { value: 'large', label: t('sizePicker.large'), detail: t('sizePicker.moreThan120M') },
  ]
}

/** Two options for the project size. Disabled while a built area decides it. */
export function SizePicker({ value, onChange, disabled }) {
  return (
    <fieldset className="size-picker" disabled={disabled}>
      <legend>{t('sizePicker.projectSize')}</legend>
      {sizes().map((size) => (
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
