import { useEffect, useRef, useState } from 'react'
import { tmdb } from '../../api/tmdb'
import { prefersReducedMotion } from '../../lib/gsap'
import { getMediaType, getTitle, getYear } from '../../utils/format'
import Button from '../ui/Button'
import Chip from '../ui/Chip'
import Container from '../ui/Container'
import Eyebrow from '../ui/Eyebrow'
import FilterDropdown from '../ui/FilterDropdown'
import MediaTypeToggle from '../ui/MediaTypeToggle'
import RatingPill from '../ui/RatingPill'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  TagIcon,
} from '../ui/icons'
import MediaCard from './MediaCard'
import { useFetch } from '../../hooks/useFetch'

function shuffle(items) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }
  return shuffled
}

export default function LuckyPick() {
  const [mediaType, setMediaType] = useState('movie')
  const [genre, setGenre] = useState('')
  const [items, setItems] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [error, setError] = useState(null)
  const [spinDelay, setSpinDelay] = useState(420)
  const timerRef = useRef(null)
  const requestRef = useRef(null)
  const {
    data: genreData,
    loading: genresLoading,
    error: genresError,
  } = useFetch((signal) => tmdb.genres(mediaType, signal), [mediaType])

  const genres = genreData?.genres ?? []
  const selectedGenre = genres.find((item) => String(item.id) === genre)

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current)
      requestRef.current?.abort()
    },
    []
  )

  const handlePick = async () => {
    window.clearTimeout(timerRef.current)
    requestRef.current?.abort()

    const controller = new AbortController()
    requestRef.current = controller
    setLoading(true)
    setSpinning(false)
    setError(null)

    try {
      const page = Math.floor(Math.random() * 25) + 1
      const response = await tmdb.discover(
        mediaType,
        {
          page,
          sort_by: 'popularity.desc',
          include_adult: false,
          'vote_count.gte': 50,
          with_genres: genre || undefined,
        },
        controller.signal
      )

      if (controller.signal.aborted) return

      const candidates = shuffle(
        (response.results ?? [])
          .filter((item) => item.id && item.poster_path)
          .map((item) => ({ ...item, media_type: mediaType }))
      )

      if (!candidates.length) {
        throw new Error('No titles came back this time. Give it another try.')
      }

      setItems(candidates)
      setActiveIndex(0)
      setLoading(false)

      const spinSteps = candidates.length > 1
        ? 1 + Math.floor(Math.random() * (candidates.length - 1))
        : 0

      if (prefersReducedMotion() || spinSteps === 0) {
        setActiveIndex(spinSteps)
        return
      }

      let step = 0
      setSpinning(true)

      const advance = () => {
        step += 1
        setActiveIndex(step)

        const delay = Math.min(440, 65 + step * 14)
        setSpinDelay(delay)

        if (step >= spinSteps) {
          setSpinning(false)
          return
        }

        timerRef.current = window.setTimeout(advance, delay)
      }

      timerRef.current = window.setTimeout(advance, 90)
    } catch (fetchError) {
      if (controller.signal.aborted) return
      setError(fetchError)
      setLoading(false)
      setSpinning(false)
    }
  }

  const changeMediaType = (nextType) => {
    window.clearTimeout(timerRef.current)
    requestRef.current?.abort()
    setMediaType(nextType)
    setGenre('')
    setItems([])
    setActiveIndex(0)
    setLoading(false)
    setSpinning(false)
    setError(null)
  }

  const moveCarousel = (direction) => {
    setActiveIndex((index) =>
      Math.max(0, Math.min(index + direction, items.length - 1))
    )
  }

  const activeItem = items[activeIndex]

  return (
    <section className="mt-18 max-sm:mt-13">
      <Container>
        <div className="mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-3.5">
          <div className="flex flex-col gap-2.5">
            <Eyebrow>Your next watch</Eyebrow>
            <h2 className="text-[clamp(1.5rem,2.6vw,2.1rem)] text-foreground">
              Can't decide what to watch?
            </h2>
          </div>
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-3 pb-1 max-sm:w-full max-sm:pb-0">
            <FilterDropdown
              label="Genre"
              value={selectedGenre?.name}
              icon={TagIcon}
              active={Boolean(genre)}
              align="right"
              panelClassName="w-[min(420px,calc(100vw-40px))]"
            >
              {({ close }) => (
                <div className="flex max-h-[min(60vh,360px)] flex-wrap content-start gap-2 overflow-y-auto p-1">
                  <Chip
                    as="button"
                    type="button"
                    active={!genre}
                    onClick={() => {
                      setGenre('')
                      close()
                    }}
                  >
                    Any genre
                  </Chip>
                  {genres.map((item) => (
                    <Chip
                      key={item.id}
                      as="button"
                      type="button"
                      active={String(item.id) === genre}
                      onClick={() => {
                        setGenre(String(item.id))
                        close()
                      }}
                    >
                      {item.name}
                    </Chip>
                  ))}
                  {genresLoading && (
                    <p className="w-full px-2 py-1 text-sm text-muted" role="status">
                      Loading genres…
                    </p>
                  )}
                  {genresError && (
                    <p className="w-full px-2 py-1 text-sm text-flame" role="alert">
                      Genres could not be loaded.
                    </p>
                  )}
                </div>
              )}
            </FilterDropdown>
            <MediaTypeToggle value={mediaType} onChange={changeMediaType} />
          </div>
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-flame/10 via-surface to-surface-muted shadow-soft lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col items-start justify-center p-6 sm:p-9 lg:p-11">
            <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-flame/10 text-flame">
              <StarIcon className="size-6" />
            </span>
            <h3 className="text-[clamp(1.65rem,3vw,2.25rem)] leading-tight text-foreground">
              Leave it to fate.
            </h3>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Pick a genre or let us surprise you with a random{' '}
              {mediaType === 'tv' ? 'series' : 'movie'}. Spin again or browse
              the picks.
            </p>
            <Button
              className="mt-5"
              onClick={handlePick}
              disabled={loading || spinning}
            >
              <StarIcon />
              {loading
                ? 'Finding titles…'
                : spinning
                  ? 'Picking…'
                  : items.length
                    ? 'Try your luck again'
                    : 'Feeling lucky?'}
            </Button>
            {error && (
              <p className="mt-3 text-sm text-flame" role="alert">
                {error.message}
              </p>
            )}
          </div>

          <div className="relative min-w-0 border-t border-border/70 p-5 sm:p-8 lg:border-t-0 lg:border-l lg:p-9">
            {items.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-soft">
                    {spinning
                      ? 'The carousel is choosing…'
                      : 'Your lucky pick'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveCarousel(-1)}
                      disabled={spinning || activeIndex === 0}
                      aria-label="Show previous lucky pick"
                      className="grid size-9 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-flame hover:text-flame disabled:opacity-45"
                    >
                      <ChevronLeftIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCarousel(1)}
                      disabled={spinning || activeIndex === items.length - 1}
                      aria-label="Show next lucky pick"
                      className="grid size-9 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-flame hover:text-flame disabled:opacity-45"
                    >
                      <ChevronRightIcon className="size-4" />
                    </button>
                  </div>
                </div>

                <div
                  className="overflow-hidden rounded-2xl"
                  role="region"
                  aria-label="Random title carousel"
                  aria-roledescription="carousel"
                >
                  <div
                    className="flex"
                    style={{
                      transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
                      transition: `transform ${spinning ? spinDelay : 450}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
                    }}
                  >
                    {items.map((item, index) => {
                      const isActive = index === activeIndex
                      const title = getTitle(item)
                      const type = getMediaType(item)

                      return (
                        <div
                          key={`${type}-${item.id}`}
                          className="flex min-w-0 flex-[0_0_100%] items-center gap-5 px-1 py-1 sm:gap-7"
                          role="group"
                          aria-roledescription="slide"
                          aria-label={`${index + 1} of ${items.length}: ${title}`}
                          aria-hidden={!isActive}
                          inert={!isActive}
                        >
                          <MediaCard
                            item={item}
                            className="w-[clamp(112px,22vw,164px)] shrink-0 gap-2.5"
                          />
                          <div className="min-w-0">
                            <p className="mb-2 text-xs font-bold tracking-[0.14em] text-flame uppercase">
                              {type === 'tv' ? 'TV series' : 'Movie'}
                            </p>
                            <h4 className="line-clamp-2 font-display text-[clamp(1.25rem,2.5vw,1.8rem)] leading-tight text-foreground">
                              {title}
                            </h4>
                            <div className="mt-3 flex flex-wrap items-center gap-2.5">
                              <RatingPill score={item.vote_average} />
                              <span className="text-sm text-muted">
                                {getYear(item) || '—'}
                              </span>
                            </div>
                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted max-sm:hidden">
                              {item.overview || 'Explore this title to learn more.'}
                            </p>
                            <Button
                              to={`/${type}/${item.id}`}
                              variant="outline"
                              size="sm"
                              className="mt-4"
                            >
                              View details
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <p className="sr-only" aria-live="polite" aria-atomic="true">
                  {!spinning && activeItem
                    ? `Your lucky pick is ${getTitle(activeItem)}.`
                    : ''}
                </p>
              </>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-10 text-center sm:min-h-[300px]">
                <span className="grid size-12 place-items-center rounded-full bg-flame/10 text-flame">
                  <StarIcon className="size-5" />
                </span>
                <p className="mt-4 font-display text-xl text-foreground">
                  A good watch is one click away.
                </p>
                <p className="mt-1 text-sm text-muted">
                  Your random {mediaType === 'tv' ? 'series' : 'movie'} will land here.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
