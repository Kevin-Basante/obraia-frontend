import './ThemeButton.css'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  )
}

/** Shows the theme it switches to: a moon in the light theme and a sun in the dark one. */
export function ThemeButton({ theme, onToggle }) {
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-button"
      onClick={onToggle}
      aria-label={`Switch to the ${next} theme`}
      title={`Switch to the ${next} theme`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
