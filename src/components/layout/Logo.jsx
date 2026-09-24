import { Link } from 'react-router-dom'

export default function Logo({ light = false, className = '' }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 text-[1.28rem] leading-none transition-transform duration-300 hover:-translate-y-px max-[480px]:text-[1.1rem] ${className}`}
      aria-label="WhatsPoppin — home"
    >
      <span className="size-[38px] shrink-0 overflow-hidden rounded-[11px] shadow-[0_8px_20px_rgba(29,22,22,0.22)] transition-shadow duration-300 max-[480px]:size-8">
        <svg viewBox="0 0 64 64" className="size-full">
          <rect width="64" height="64" rx="15" fill="#1D1616" />
          <circle cx="32" cy="32" r="17" fill="#D84040" />
          <path d="M27.5 23.5 45 32l-17.5 8.5z" fill="#EEEEEE" />
          <circle cx="49" cy="15" r="4.5" fill="#8E1616" />
        </svg>
      </span>
      <span
        className={`font-sans font-extrabold tracking-[-0.03em] whitespace-nowrap ${
          light ? 'text-cloud' : 'text-foreground'
        }`}
      >
        Whats
        <em
          className={`font-display font-bold italic ${
            light ? 'text-cloud/80' : 'text-flame'
          }`}
        >
          Poppin
        </em>
      </span>
    </Link>
  )
}
