import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from './icons'

export default function FilterDropdown({
  label,
  value,
  icon: Icon,
  active = false,
  align = 'left',
  panelClassName = '',
  children,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.85rem] font-semibold whitespace-nowrap transition-all duration-300 ${
          active || open
            ? 'border-flame bg-flame/10 text-flame'
            : 'border-border bg-surface text-soft hover:border-flame hover:text-flame'
        }`}
      >
        {Icon && <Icon className="size-4 shrink-0 opacity-80" />}
        <span>{value ? `${label}: ${value}` : label}</span>
        <ChevronDownIcon
          className={`size-4 shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-[calc(100%+8px)] z-50 max-w-[calc(100vw-32px)] rounded-2xl border border-border bg-surface p-3 shadow-float ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${panelClassName}`}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  )
}
