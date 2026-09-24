import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:
    'bg-flame text-white shadow-glow hover:-translate-y-0.5 hover:bg-crimson',
  dark: 'bg-ink text-cloud hover:-translate-y-0.5 hover:bg-ink-2 hover:shadow-card',
  ghost:
    'border-cloud/40 bg-cloud/10 text-cloud backdrop-blur-md hover:-translate-y-0.5 hover:bg-cloud/20',
  outline:
    'border-border bg-surface text-foreground hover:-translate-y-0.5 hover:border-flame hover:text-flame hover:shadow-soft',
}

const SIZES = {
  md: 'gap-2.5 px-6 py-3.5 text-[0.95rem] [&_svg]:size-[18px]',
  sm: 'gap-2 px-4.5 py-2 text-[0.85rem] [&_svg]:size-[15px]',
}

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const Tag = as ?? (to ? Link : href ? 'a' : 'button')
  const props = { ...rest }

  if (to) props.to = to
  if (href) props.href = href
  if (Tag === 'button' && !props.type) props.type = 'button'

  return (
    <Tag
      className={`inline-flex items-center justify-center rounded-full border-[1.5px] border-transparent font-semibold leading-tight whitespace-nowrap transition-all duration-300 active:translate-y-px active:scale-[0.99] disabled:pointer-events-none disabled:opacity-55 [&_svg]:shrink-0 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
