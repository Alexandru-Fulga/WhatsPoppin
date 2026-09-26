import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { buildDiscoverParams, tmdb } from '../api/tmdb'
import BrowseFilters from '../components/media/BrowseFilters'
import MediaGrid from '../components/media/MediaGrid'
import Button from '../components/ui/Button'
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
  const provider = searchParams.get('provider') ?? ''
  const year = searchParams.get('year') ?? ''
  const copy = COPY[mediaType]

  useDocumentTitle(copy.title)

  const { data: genreData } = useFetch(
    (signal) => tmdb.genres(mediaType, signal),
    [mediaType]
  )
  const genres = genreData?.genres ?? []

  const { data: providerList } = useFetch(
    (signal) => tmdb.watchProviders(mediaType, undefined, signal),
    [mediaType],
    { enabled: Boolean(provider) }
  )
  const activeProvider = provider
    ? providerList?.results?.find(
        (item) => String(item.provider_id) === provider
      )
    : null

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
          ...buildDiscoverParams(mediaType, { genre, sort, provider, year }),
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
  }, [mediaType, genre, sort, provider, year, reloadKey])

  const loadMore = () => {
    if (loadingMore || loading || page >= totalPages) return
    const nextPage = page + 1
    setLoadingMore(true)

    tmdb
      .discover(mediaType, {
        ...buildDiscoverParams(mediaType, { genre, sort, provider }),
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

  const clearFilters = () => setSearchParams(new URLSearchParams())

  return (
    <Container className="pt-[calc(var(--nav-h)+56px)]">
      <header className="mb-9 flex max-w-[720px] flex-col gap-3.5">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 className="text-[clamp(2.2rem,4.6vw,3.3rem)]">{copy.title}</h1>
        <p className="text-base leading-[1.7] text-soft">{copy.blurb}</p>
      </header>

      <BrowseFilters
        mediaType={mediaType}
        genres={genres}
        genre={genre}
        sort={sort}
        year={year}
        provider={provider}
        activeProvider={activeProvider}
        onChange={updateParam}
        onClear={clearFilters}
      />

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
          message={
            provider
              ? `No titles found on ${
                  activeProvider?.provider_name ?? 'this service'
                } with these filters.`
              : year
                ? `No titles found from ${year} with these filters.`
                : 'Try a different genre, year or sort order.'
          }
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
