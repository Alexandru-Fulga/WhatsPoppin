import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { tmdb } from '../api/tmdb'
import MediaGrid from '../components/media/MediaGrid'
import SearchBar from '../components/search/SearchBar'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Eyebrow from '../components/ui/Eyebrow'
import { EmptyState, ErrorState } from '../components/ui/States'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import { dedupeById } from '../utils/format'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const type = searchParams.get('type') ?? 'all'

  useDocumentTitle(query ? `Search: ${query}` : 'Search')

  const { data: trending, loading: trendingLoading } = useFetch(
    (signal) => tmdb.trending('all', 'week', 1, signal),
    []
  )

  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!query) {
      setItems([])
      setLoading(false)
      setError(null)
      return undefined
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const run =
      type === 'movie'
        ? tmdb.searchMovie
        : type === 'tv'
          ? tmdb.searchTv
          : tmdb.searchMulti

    run(query, 1, controller.signal)
      .then((data) => {
        const results = (data.results ?? []).filter(
          (item) => type !== 'all' || item.media_type !== 'person'
        )
        setItems(results)
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
  }, [query, type, reloadKey])

  const loadMore = () => {
    if (loadingMore || loading || page >= totalPages) return
    const nextPage = page + 1
    setLoadingMore(true)

    const run =
      type === 'movie'
        ? tmdb.searchMovie
        : type === 'tv'
          ? tmdb.searchTv
          : tmdb.searchMulti

    run(query, nextPage)
      .then((data) => {
        const results = (data.results ?? []).filter(
          (item) => type !== 'all' || item.media_type !== 'person'
        )
        setItems((previous) => dedupeById([...previous, ...results]))
        setPage(nextPage)
        setLoadingMore(false)
      })
      .catch(() => setLoadingMore(false))
  }

  const updateType = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('type')
    else next.set('type', value)
    setSearchParams(next)
  }

  const trendingItems = (trending?.results ?? []).filter(
    (item) => item.media_type !== 'person' && item.poster_path
  )

  return (
    <Container className="pt-[calc(var(--nav-h)+56px)]">
      <header className="mb-9 flex max-w-[720px] flex-col gap-3.5">
        <Eyebrow>Search</Eyebrow>
        <h1 className="text-[clamp(2.2rem,4.6vw,3.3rem)]">
          {query ? (
            <>
              Results for <em className="text-flame italic">“{query}”</em>
            </>
          ) : (
            'Search Whats-Poppin'
          )}
        </h1>
        <p className="text-base leading-[1.7] text-soft">
          {query
            ? 'Ratings, cast, trailers and streaming availability for every match.'
            : 'Find movies, TV shows and people. Ratings, cast, trailers and where to stream — all in one place.'}
        </p>
        <div className="mt-1.5 max-w-[560px]">
          <SearchBar autoFocus />
        </div>
      </header>

      {!query ? (
        <div className="mt-12">
          <MediaGrid
            items={trendingItems}
            loading={trendingLoading}
            skeletonCount={12}
          />
        </div>
      ) : (
        <>
          <div
            className="mb-7 inline-flex gap-1 rounded-full border border-border bg-surface p-1.5"
            role="tablist"
            aria-label="Result type"
          >
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={type === tab.value}
                className={`rounded-full px-4.5 py-2 text-[0.87rem] font-semibold transition-colors duration-300 ${
                  type === tab.value
                    ? 'bg-foreground text-background'
                    : 'text-soft hover:text-flame'
                }`}
                onClick={() => updateType(tab.value)}
              >
                {tab.label}
              </button>
            ))}
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
              title={`No results for “${query}”`}
              message="Try a different spelling, or search for an actor, director or character."
            />
          ) : (
            <>
              <MediaGrid
                items={items}
                mediaType={type === 'all' ? undefined : type}
                showType={type === 'all'}
              />
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
                    That&rsquo;s all {items.length} results.
                  </p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </Container>
  )
}
