import { useTheme } from '../../hooks/useTheme'
import { MoonIcon, SunIcon } from '../ui/icons'

export default function ThemeToggle({ transparent = false }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`grid size-[42px] shrink-0 place-items-center rounded-xl border transition-colors duration-300 ${
        transparent
          ? 'border-cloud/30 bg-cloud/15 text-cloud backdrop-blur-md hover:bg-cloud/25'
          : 'border-border bg-surface text-foreground hover:border-flame hover:text-flame'
      }`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <SunIcon className="size-5" />
      ) : (
        <MoonIcon className="size-5" />
      )}
    </button>
  )
}
