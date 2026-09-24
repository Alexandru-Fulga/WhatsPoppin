import { Link } from 'react-router-dom'
import Eyebrow from './Eyebrow'
import { ArrowRightIcon } from './icons'

export default function SectionHeader({
  eyebrow,
  title,
  action,
  actionHref,
  children,
  className = '',
}) {
  return (
    <div
      className={`mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-3.5 ${className}`}
    >
      <div className="flex flex-col gap-2.5">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-[clamp(1.5rem,2.6vw,2.1rem)] text-foreground">{title}</h2>
      </div>
      <div className="flex shrink-0 items-center gap-4 pb-1 max-sm:pb-0">
        {children}
        {action && actionHref && (
          <Link
            to={actionHref}
            className="group inline-flex items-center gap-2 text-[0.9rem] font-semibold whitespace-nowrap text-flame transition-all duration-300 hover:gap-3 hover:text-crimson"
          >
            {action}
            <ArrowRightIcon className="size-[17px] transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  )
}
