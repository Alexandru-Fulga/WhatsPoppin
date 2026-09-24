import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import { CloseIcon } from './icons'

export default function TrailerModal({ videoKey, title, onClose }) {
  const overlayRef = useRef(null)
  const closingRef = useRef(false)

  const requestClose = () => {
    if (closingRef.current) return
    closingRef.current = true

    if (prefersReducedMotion() || !overlayRef.current) {
      onClose()
      return
    }

    gsap.to('.trailer-modal__panel', {
      opacity: 0,
      scale: 0.95,
      y: 14,
      duration: 0.24,
      ease: 'power2.in',
    })
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.26,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') requestClose()
    }

    document.addEventListener('keydown', handleKey)
    document.body.classList.add('no-scroll')

    let ctx
    if (!prefersReducedMotion()) {
      ctx = gsap.context(() => {
        gsap.from(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.from('.trailer-modal__panel', {
          opacity: 0,
          scale: 0.93,
          y: 26,
          duration: 0.5,
          ease: 'power3.out',
          delay: 0.05,
        })
      }, overlayRef)
    }

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.classList.remove('no-scroll')
      ctx?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="fixed inset-0 z-200 grid place-items-center bg-ink-deep/82 p-6 backdrop-blur-md max-sm:p-3"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <div className="trailer-modal__panel w-[min(960px,100%)] overflow-hidden rounded-3xl border border-cloud/15 bg-ink-deep shadow-float">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <h3 className="truncate text-[1.05rem] text-cloud">{title} — Official Trailer</h3>
          <button
            type="button"
            className="grid size-[38px] shrink-0 place-items-center rounded-full bg-cloud/10 text-cloud transition-all duration-300 hover:rotate-90 hover:bg-cloud/20 hover:text-white"
            onClick={requestClose}
            aria-label="Close trailer"
          >
            <CloseIcon className="size-[18px]" />
          </button>
        </div>
        <div className="aspect-video bg-black [&_iframe]:size-full [&_iframe]:border-0">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
