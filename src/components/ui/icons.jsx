const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function StarIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.6l2.85 5.9 6.5.9-4.72 4.54 1.14 6.46L12 17.34 6.23 20.4l1.14-6.46L2.65 9.4l6.5-.9L12 2.6z" />
    </svg>
  )
}

export function PlayIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.4c0-.9 1-1.5 1.8-1l9.3 5.9c.7.5.7 1.5 0 2l-9.3 5.9c-.8.5-1.8-.1-1.8-1V5.4z" />
    </svg>
  )
}

export function SearchIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

export function CloseIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function MenuIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function ArrowRightIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

export function ChevronLeftIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M14.5 6L8.5 12l6 6" />
    </svg>
  )
}

export function ChevronRightIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M9.5 6l6 6-6 6" />
    </svg>
  )
}

export function ChevronDownIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  )
}

export function CalendarIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="16" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  )
}

export function ClockIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function FilmIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <rect x="3.5" y="4" width="17" height="16" rx="3" />
      <path d="M8 4v16M16 4v16M3.5 9h4.5M3.5 15h4.5M16 9h4.5M16 15h4.5" />
    </svg>
  )
}

export function TvIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <rect x="3" y="7.5" width="18" height="12.5" rx="3" />
      <path d="M8.5 3.5L12 7l3.5-3.5" />
    </svg>
  )
}

export function ExternalLinkIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v4.5A1.5 1.5 0 0116.5 20h-11A1.5 1.5 0 014 18.5v-11A1.5 1.5 0 015.5 6H10" />
    </svg>
  )
}

export function LinkIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M10 13.5a4 4 0 005.7 0l3.1-3.1a4 4 0 00-5.7-5.7L11.6 6.2" />
      <path d="M14 10.5a4 4 0 00-5.7 0l-3.1 3.1a4 4 0 005.7 5.7l1.5-1.5" />
    </svg>
  )
}

export function CheckIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function AlertIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M12 3.5l9.5 16.5h-19L12 3.5z" />
      <path d="M12 10v4.5M12 17.5v.1" />
    </svg>
  )
}

export function UserIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <circle cx="12" cy="8" r="3.75" />
      <path d="M4.5 20.5c.8-3.6 3.9-5.5 7.5-5.5s6.7 1.9 7.5 5.5" />
    </svg>
  )
}

export function GlobeIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5z" />
    </svg>
  )
}

export function InfoIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 7.8v.1" />
    </svg>
  )
}

export function SunIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.55 1.55M17.15 17.15l1.55 1.55M18.7 5.3l-1.55 1.55M6.85 17.15L5.3 18.7" />
    </svg>
  )
}

export function MoonIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M20.5 14.1A8.5 8.5 0 019.9 3.5a8.5 8.5 0 1010.6 10.6z" />
    </svg>
  )
}
