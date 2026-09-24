import { useEffect, useRef } from 'react'
import MediaCard from './MediaCard'
import Reveal from '../ui/Reveal'
import { RowSkeleton } from '../ui/Skeletons'
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/icons'

export default function MediaRow({
  items = [],
  loading = false,
  mediaType,
  skeletonCount = 7,
  label,
}) {
  const trackRef = useRef(null)
  const hoveredRef = useRef(false)

  const scrollBy = (direction) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.85),
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      const track = trackRef.current
      if (!track) return

      const target = event.target
      const tag = target?.tagName
      const isTyping =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target?.isContentEditable
      if (isTyping) return

      const hasFocus = track.contains(document.activeElement)
      if (!hoveredRef.current && !hasFocus) return

      event.preventDefault()
      scrollBy(event.key === 'ArrowLeft' ? -1 : 1)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (loading) {
    return <RowSkeleton count={skeletonCount} />
  }

  const arrowClasses =
    'absolute top-[40%] z-5 -mt-[22px] grid size-11 place-items-center rounded-full border border-border bg-cloud/95 text-ink opacity-0 shadow-soft transition-all duration-300 group-hover/row:opacity-100 hover:scale-[1.07] hover:bg-ink hover:text-cloud focus-visible:opacity-100 max-[900px]:hidden'

  return (
    <div
      className="group/row relative"
      onMouseEnter={() => {
        hoveredRef.current = true
      }}
      onMouseLeave={() => {
        hoveredRef.current = false
      }}
    >
      <button
        type="button"
        className={`${arrowClasses} -left-3.5`}
        onClick={() => scrollBy(-1)}
        aria-label={label ? `Scroll ${label} left` : 'Scroll left'}
      >
        <ChevronLeftIcon className="size-5" />
      </button>

      <Reveal
        ref={trackRef}
        className="no-scrollbar -mx-1 -mt-1.5 flex snap-x snap-proximity gap-5 overflow-x-auto rounded-2xl px-1 pt-1.5 pb-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-flame max-[900px]:gap-3.5"
        stagger={0.05}
        y={24}
        tabIndex={0}
        role="group"
        aria-label={label ? `${label} — scrollable row` : 'Scrollable media row'}
      >
        {items.map((item) => (
          <div
            className="w-[clamp(152px,17vw,198px)] flex-none snap-start"
            key={`${item.media_type ?? mediaType ?? ''}-${item.id}`}
          >
            <MediaCard item={item} mediaType={mediaType} />
          </div>
        ))}
      </Reveal>

      <button
        type="button"
        className={`${arrowClasses} -right-3.5`}
        onClick={() => scrollBy(1)}
        aria-label={label ? `Scroll ${label} right` : 'Scroll right'}
      >
        <ChevronRightIcon className="size-5" />
      </button>
    </div>
  )
}
