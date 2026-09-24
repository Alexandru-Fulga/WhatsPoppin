import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BROWSE_SORTS, buildDiscoverParams, tmdb } from '../api/tmdb'
import MediaGrid from '../components/media/MediaGrid'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import Container from '../components/ui/Container'
import Eyebrow from '../components/ui/Eyebrow'
import { EmptyState, ErrorState } from '../components/ui/States'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import { dedupeById } from '../utils/format'

const COPY = {
  movie: {
    eyebrow: 'Browse the catalogue',
    title: 'Movies',
    blurb:
      'From blockbusters to hidden gems — filter by genre, sort by what matters and find your next watch.',
  },
  tv: {
    eyebrow: 'Binge away',
    title: 'TV Shows',
    blurb:
      'Series that are airing now, all-time greats and everything in between. Your next binge starts here.',
  },
}

export default function Browse({ mediaType }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const genre = searchParams.get('genre') ?? ''
  const sort = searchParams.get('sort') ?? 'popular'
  const copy = COPY[mediaType]

  useDocumentTitle(copy.title)

  const { data: genreData } = useFetch(
    (signal) => tmdb.genres(mediaType, signal),
    [mediaType]
  )
  const genres = genreData?.genres ?? []

  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    tmdb
      .discover(
        mediaType,
        {
          ...buildDiscoverParams(mediaType, { genre, sort }),
          page: 1,
        },
        controller.signal
      )
      .then((data) => {
        setItems(data.results ?? [])
        setTotalPages(Math.min(data.total_pages ?? 1, 500))
        setPage(1)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err)
        setLoading(false)
      })

    return () => controller.abort()
  }, [mediaType, genre, sort, reloadKey])

  const loadMore = () => {
    if (loadingMore || loading || page >= totalPages) return
    const nextPage = page + 1
    setLoadingMore(true)

    tmdb
      .discover(mediaType, {
        ...buildDiscoverParams(mediaType, { genre, sort }),
        page: nextPage,
      })
      .then((data) => {
        setItems((previous) =>
          dedupeById([...previous, ...(data.results ?? [])])
        )
        setPage(nextPage)
        setLoadingMore(false)
      })
      .catch(() => setLoadingMore(false))
  }

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <Container className="pt-[calc(var(--nav-h)+56px)]">
      <header className="mb-9 flex max-w-[720px] flex-col gap-3.5">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 className="text-[clamp(2.2rem,4.6vw,3.3rem)]">{copy.title}</h1>
        <p className="text-base leading-[1.7] text-soft">{copy.blurb}</p>
      </header>

      <div className="sticky top-[var(--nav-h)] z-20 mb-7 flex items-start justify-between gap-5 border-b border-border bg-background/92 py-3.5 backdrop-blur-md max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:gap-3">
        <div
          className="no-scrollbar flex flex-1 flex-wrap gap-2 max-[860px]:flex-nowrap max-[860px]:overflow-x-auto max-[860px]:pb-1.5"
          role="group"
          aria-label="Filter by genre"
        >
          <Chip
            as="button"
            type="button"
            active={!genre}
            className="max-[860px]:shrink-0"
            onClick={() => updateParam('genre', '')}
          >
            All genres
          </Chip>
          {genres.map((item) => (
            <Chip
              key={item.id}
              as="button"
              type="button"
              active={String(item.id) === genre}
              className="max-[860px]:shrink-0"
              onClick={() => updateParam('genre', String(item.id))}
            >
              {item.name}
            </Chip>
          ))}
        </div>

        <label className="flex shrink-0 items-center gap-2.5 pt-0.5 max-[860px]:justify-end">
          <span className="text-[0.8rem] font-semibold whitespace-nowrap text-muted">
            Sort by
          </span>
          <select
            className="cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-[0.85rem] font-medium text-foreground transition-all focus:border-flame focus:ring-3 focus:ring-flame/15 focus:outline-none"
            value={sort}
            onChange={(event) => updateParam('sort', event.target.value)}
          >
            {BROWSE_SORTS[mediaType].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <ErrorState
          message={error.message}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      ) : loading ? (
        <MediaGrid loading skeletonCount={12} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          message="Try a different genre or sort order."
        />
      ) : (
        <>
          <MediaGrid items={items} mediaType={mediaType} />
          <div className="mt-12 flex justify-center">
            {page < totalPages ? (
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </Button>
            ) : (
              <p className="text-[0.9rem] text-muted">
                That&rsquo;s all {items.length} titles — you&rsquo;ve reached
                the end.
              </p>
            )}
          </div>
        </>
      )}
    </Container>
  )
}
