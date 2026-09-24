export default function Chip({
  as: Tag = 'span',
  active = false,
  soft = false,
  dark = false,
  className = '',
  children,
  ...rest
}) {
  const interactive = Tag !== 'span'

  const base =
    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.84rem] font-medium leading-tight transition-all duration-300'

  let tone = 'border-border bg-surface text-soft'
  if (soft) tone = 'border-transparent bg-surface-muted text-soft'
  if (dark) tone = 'border-cloud/25 bg-cloud/10 text-cloud/90'
  if (active) tone = 'border-foreground bg-foreground text-background'

  let hover = ''
  if (interactive && !active) {
    hover = dark
      ? 'hover:-translate-y-0.5 hover:border-cloud/50 hover:bg-cloud/20 hover:text-white'
      : 'hover:-translate-y-0.5 hover:border-flame hover:bg-flame/10 hover:text-flame'
  }

  return (
    <Tag className={`${base} ${tone} ${hover} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
