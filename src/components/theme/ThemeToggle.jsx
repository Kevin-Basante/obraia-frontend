import { useTheme } from '../../hooks/useTheme.js'
import { ThemeButton } from './ThemeButton.jsx'

/** Button of the top bar that switches between the light and the dark theme. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return <ThemeButton theme={theme} onToggle={toggleTheme} />
}
