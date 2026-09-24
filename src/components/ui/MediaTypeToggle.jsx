const TONES = {
  light: {
    group: 'border-border bg-surface',
    active: 'bg-foreground text-background',
    idle: 'text-soft hover:text-flame',
  },
  dark: {
    group: 'border-cloud/15 bg-cloud/10',
    active: 'bg-cloud text-ink',
    idle: 'text-cloud/75 hover:text-white',
  },
}

const OPTIONS = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
]

export default function MediaTypeToggle({
  value,
  onChange,
  tone = 'light',
  className = '',
}) {
  const styles = TONES[tone]

  return (
    <div
      className={`inline-flex gap-1 rounded-full border p-1.5 ${styles.group} ${className}`}
      role="tablist"
      aria-label="Choose media type"
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`rounded-full px-4.5 py-2 text-[0.86rem] font-semibold transition-colors duration-300 ${
              isActive ? styles.active : styles.idle
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
