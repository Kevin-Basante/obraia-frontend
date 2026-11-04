import './BrandLogo.css'

/** Mark of ObraIA: a house drawn as a blueprint, with a dimension line under it. */
export function BrandLogo({ size = 34 }) {
  return (
    <svg className="brand-logo" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect className="brand-logo__tile" x="1" y="1" width="38" height="38" rx="5" />
      <path className="brand-logo__house" d="M10 19.5 20 11l10 8.5M13 17v11h14V17M18 28v-6h4v6" />
      <path className="brand-logo__measure" d="M11 32.5h18M11 31v3M29 31v3" />
    </svg>
  )
}
