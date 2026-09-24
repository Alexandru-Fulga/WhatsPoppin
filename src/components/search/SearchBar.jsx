import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { imageUrl, tmdb } from '../../api/tmdb'
import { useDebounce } from '../../hooks/useDebounce'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import {
  getInitials,
  getMediaType,
  getTitle,
  getYear,
} from '../../utils/format'
import RatingPill from '../ui/RatingPill'
import SearchInput from './SearchInput'

export default function SearchBar({
  onNavigate,
  autoFocus = false,
  variant = 'light',
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const debounced = useDebounce(query, 320)
  const rootRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const term = debounced.trim()
    if (term.length < 2) {
      setResults([])
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()
    setLoading(true)

    tmdb
      .searchMulti(term, 1, controller.signal)
      .then((data) => {
        setResults((data.results ?? []).slice(0, 7))
        setLoading(false)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setLoading(false)
      })

    return () => controller.abort()
  }, [debounced])

  useEffect(() => {
    setHighlighted(-1)
    setOpen(query.trim().length >= 2)
  }, [query])

  useEffect(() => {
    const handleClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!open || !dropdownRef.current || prefersReducedMotion()) return undefined
    const ctx = gsap.context(() => {
      gsap.from(dropdownRef.current, {
        opacity: 0,
        y: 10,
        scale: 0.98,
        duration: 0.32,
        ease: 'power2.out',
      })
      gsap.from('.search-dropdown__item', {
        opacity: 0,
        x: -10,
        stagger: 0.04,
        duration: 0.3,
        ease: 'power2.out',
      })
    }, rootRef)
    return () => ctx.revert()
  }, [open, results.length])

  const goTo = (item) => {
    setOpen(false)
    setQuery('')
    onNavigate?.()

    if (item) {
      const type = item.media_type === 'person' ? 'person' : getMediaType(item)
      navigate(`/${type}/${item.id}`)
      return
    }

    const term = query.trim()
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (highlighted >= 0 && results[highlighted]) {
      goTo(results[highlighted])
    } else {
      goTo(null)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setHighlighted((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted((index) => Math.max(index - 1, -1))
    } else if (event.key === 'Escape') {
      setOpen(false)
      event.currentTarget.blur()
    }
  }

  const showDropdown = open && query.trim().length >= 2

  return (
    <form
      className="relative w-full"
      ref={rootRef}
      role="search"
      onSubmit={handleSubmit}
    >
      <SearchInput
        value={query}
        onChange={setQuery}
        onFocus={() => query.trim().length >= 2 && setOpen(true)}
        onKeyDown={handleKeyDown}
        variant={variant}
        autoFocus={autoFocus}
      />

      {showDropdown && (
        <div
          className="search-dropdown absolute inset-x-0 top-[calc(100%+10px)] z-100 rounded-2xl border border-border bg-surface p-2 shadow-float max-[560px]:fixed max-[560px]:inset-x-4 max-[560px]:top-[calc(var(--nav-h)+10px)] min-[561px]:min-w-[360px]"
          ref={dropdownRef}
        >
          {loading && (
            <p className="px-3 py-3.5 text-[0.88rem] text-muted">Searching…</p>
          )}

          {!loading && results.length === 0 && (
            <p className="px-3 py-3.5 text-[0.88rem] text-muted">
              No matches for “{query.trim()}”. Press Enter to search anyway.
            </p>
          )}

          {!loading &&
            results.map((item, index) => {
              const isPerson = item.media_type === 'person'
              const type = isPerson ? 'person' : getMediaType(item)
              const title = getTitle(item)
              const thumb = imageUrl(
                isPerson ? item.profile_path : item.poster_path,
                'w92'
              )
              const subtitle = isPerson
                ? item.known_for_department || 'Person'
                : `${getYear(item) || '—'} · ${
                    type === 'tv' ? 'TV Series' : 'Movie'
                  }`

              return (
                <button
                  type="button"
                  key={`${type}-${item.id}`}
                  className={`search-dropdown__item flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors duration-200 ${
                    index === highlighted ? 'bg-surface-muted' : 'hover:bg-surface-muted'
                  }`}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => goTo(item)}
                >
                  <span className="grid h-14 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-border">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-[0.8rem] font-bold text-flame">
                        {getInitials(title)}
                      </span>
                    )}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <strong className="block truncate text-[0.9rem] font-semibold text-foreground">
                      {title}
                    </strong>
                    <span className="text-[0.78rem] text-muted">
                      {subtitle}
                    </span>
                  </span>
                  {!isPerson && <RatingPill score={item.vote_average} />}
                </button>
              )
            })}

          {!loading && (
            <button
              type="button"
              className="mt-1 w-full rounded-b-xl border-t border-border px-3 py-3 text-center text-[0.85rem] font-semibold text-flame transition-colors duration-200 hover:bg-flame/10"
              onClick={() => goTo(null)}
            >
              See all results for “{query.trim()}”
            </button>
          )}
        </div>
      )}
    </form>
  )
}
