export default function Eyebrow({
  children,
  light = false,
  className = '',
  ...rest
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[0.76rem] font-bold tracking-[0.2em] uppercase ${
        light ? 'text-cloud' : 'text-flame'
      } ${className}`}
      {...rest}
    >
      <span
        className="h-0.5 w-[22px] rounded-full bg-current opacity-70"
        aria-hidden="true"
      />
      {children}
    </span>
  )
}
