import { useEffect, useRef, useState } from 'react'
import { imageUrl } from '../../api/tmdb'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import { getMediaType, getTitle, getYear } from '../../utils/format'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Eyebrow from '../ui/Eyebrow'
import RatingPill from '../ui/RatingPill'
import { InfoIcon, PlayIcon } from '../ui/icons'

const ROTATE_MS = 9000

export default function Hero({ items = [], onWatchTrailer, trailerLoading }) {
  const [index, setIndex] = useState(0)
  const contentRef = useRef(null)
  const backdropRefs = useRef([])
  const ctxRef = useRef(null)

  useEffect(() => {
    if (items.length < 2 || prefersReducedMotion()) return undefined
    const timer = setTimeout(() => {
      setIndex((value) => (value + 1) % items.length)
    }, ROTATE_MS)
    return () => clearTimeout(timer)
  }, [index, items.length])

  useEffect(() => {
    if (items.length < 2) return undefined

    const handleKey = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      const target = event.target
      const tag = target?.tagName
      const isTyping =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target?.isContentEditable
      if (isTyping) return
      if (document.querySelector('.trailer-modal__panel')) return
      if (document.querySelector('.media-row:hover, .media-row:focus-within')) {
        return
      }

      event.preventDefault()
      setIndex((value) => {
        const next = event.key === 'ArrowRight' ? value + 1 : value - 1
        return (next + items.length) % items.length
      })
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [items.length])

  useEffect(() => {
    if (!items.length || prefersReducedMotion()) return undefined

    ctxRef.current?.kill()
    ctxRef.current = gsap.context(() => {
      backdropRefs.current.forEach((el, i) => {
        if (!el) return
        if (i === index) {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
          )
        } else {
          gsap.to(el, { opacity: 0, duration: 1, ease: 'power2.inOut' })
        }
      })

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.querySelectorAll('[data-hero-anim]'),
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.1,
          }
        )
      }
    })
  }, [index, items])

  useEffect(
    () => () => {
      ctxRef.current?.revert()
    },
    []
  )

  if (!items.length) {
    return (
      <section
        className="relative min-h-[420px] overflow-hidden bg-ink"
        aria-hidden="true"
      />
    )
  }

  const active = items[index]
  const type = getMediaType(active)

  return (
    <section className="relative flex min-h-[clamp(580px,90vh,800px)] items-center overflow-hidden bg-ink max-sm:min-h-[540px]">
      <div className="absolute inset-0" aria-hidden="true">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`absolute inset-0 will-change-[opacity,transform] ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            ref={(el) => {
              backdropRefs.current[i] = el
            }}
          >
            <img
              src={imageUrl(item.backdrop_path, 'w1280')}
              alt=""
              fetchPriority={i === 0 ? 'high' : 'low'}
              className="size-full object-cover object-[center_22%]"
            />
          </div>
        ))}
      </div>

      <div className="scrim-hero absolute inset-0" aria-hidden="true" />
      <div
        className="fade-bottom absolute inset-x-0 bottom-0 h-[150px]"
        aria-hidden="true"
      />

      <Container className="relative z-2 flex items-end justify-between gap-12 pt-[calc(var(--nav-h)+56px)] pb-[84px] max-sm:pb-14">
        <div
          className="flex max-w-[660px] flex-col items-start gap-5 max-sm:gap-4"
          ref={contentRef}
        >
          <Eyebrow light data-hero-anim>
            Trending this week
          </Eyebrow>

          <h1
            data-hero-anim
            className="text-[clamp(2.5rem,5.6vw,4.3rem)] leading-[1.04] tracking-[-0.02em] text-cloud"
          >
            {getTitle(active)}
          </h1>

          <div data-hero-anim className="flex flex-wrap items-center gap-3">
            <RatingPill score={active.vote_average} />
            <span className="text-[0.9rem] font-medium text-cloud/85">
              {getYear(active) || '—'}
            </span>
            <span className="size-1 rounded-full bg-cloud/45" />
            <span className="text-[0.9rem] font-medium text-cloud/85">
              {type === 'tv' ? 'TV Series' : 'Movie'}
            </span>
            {active.original_language && (
              <>
                <span className="size-1 rounded-full bg-cloud/45" />
                <span className="text-[0.9rem] font-medium text-cloud/85">
                  {active.original_language.toUpperCase()}
                </span>
              </>
            )}
          </div>

          <p
            data-hero-anim
            className="line-clamp-3 max-w-[580px] text-base leading-[1.72] text-cloud/85 max-sm:line-clamp-4"
          >
            {active.overview ||
              'No overview available yet — open the details page to see everything we know about this title.'}
          </p>

          <div data-hero-anim className="mt-1.5 flex flex-wrap gap-3.5">
            <Button
              onClick={() => onWatchTrailer?.(active)}
              disabled={trailerLoading}
            >
              <PlayIcon />
              {trailerLoading ? 'Loading…' : 'Watch trailer'}
            </Button>
            <Button variant="ghost" to={`/${type}/${active.id}`}>
              <InfoIcon />
              More info
            </Button>
          </div>
        </div>

        {items.length > 1 && (
          <div
            className="hidden min-w-[216px] flex-col gap-4 pb-1.5 min-[1025px]:flex"
            role="tablist"
            aria-label="Featured titles"
          >
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`flex flex-col items-start gap-2 text-left transition-opacity duration-300 ${
                  i === index ? 'opacity-100' : 'opacity-50 hover:opacity-85'
                }`}
                onClick={() => setIndex(i)}
              >
                <span className="text-[0.7rem] font-bold tracking-[0.18em] text-cloud/80">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="max-w-[216px] truncate text-[0.86rem] font-semibold text-cloud/90">
                  {getTitle(item)}
                </span>
                <span
                  className={`slide-bar block h-0.5 w-full rounded-full bg-cloud/25 ${
                    i === index ? 'is-active' : ''
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
