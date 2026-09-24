import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tmdb } from '../api/tmdb'
import GenreExplorer from '../components/media/GenreExplorer'
import Hero from '../components/media/Hero'
import MediaRow from '../components/media/MediaRow'
import ProviderRail from '../components/media/ProviderRail'
import Container from '../components/ui/Container'
import SectionHeader from '../components/ui/SectionHeader'
import { ErrorState } from '../components/ui/States'
import TrailerModal from '../components/ui/TrailerModal'
import { useFetch } from '../hooks/useFetch'
import { getMediaType, getTitle, getTrailer } from '../utils/format'

function RowSection({
  eyebrow,
  title,
  fetcher,
  items: providedItems,
  loading: providedLoading,
  viewAllHref,
  mediaType,
}) {
  const shouldFetch = !providedItems
  const { data, loading, error, retry } = useFetch(
    shouldFetch ? fetcher : () => Promise.resolve(null),
    [],
    { enabled: shouldFetch }
  )

  const source = providedItems ?? data?.results ?? []
  const items = source.filter(
    (item) => item.media_type !== 'person' && item.poster_path
  )
  const isLoading = shouldFetch ? loading : Boolean(providedLoading)

  return (
    <section className="mt-18 max-sm:mt-13">
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          action={viewAllHref ? 'View all' : undefined}
          actionHref={viewAllHref}
        />
        {error ? (
          <ErrorState message={error.message} onRetry={retry} />
        ) : (
          <MediaRow
            items={items}
            loading={isLoading}
            mediaType={mediaType}
            label={title}
          />
        )}
      </Container>
    </section>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const {
    data: trending,
    loading: trendingLoading,
    error: trendingError,
    retry: retryTrending,
  } = useFetch((signal) => tmdb.trending('all', 'week', 1, signal), [])

  const [trailer, setTrailer] = useState(null)
  const [trailerLoading, setTrailerLoading] = useState(false)

  const heroItems = useMemo(
    () =>
      (trending?.results ?? [])
        .filter((item) => item.backdrop_path && item.media_type !== 'person')
        .slice(0, 5),
    [trending]
  )

  const handleWatchTrailer = async (item) => {
    const type = getMediaType(item)
    setTrailerLoading(true)
    try {
      const details = await tmdb.details(type, item.id)
      const video = getTrailer(details.videos?.results)
      if (video) {
        setTrailer({ video, title: getTitle(item) })
      } else {
        navigate(`/${type}/${item.id}`)
      }
    } catch {
      navigate(`/${type}/${item.id}`)
    } finally {
      setTrailerLoading(false)
    }
  }

  return (
    <div>
      {trendingError ? (
        <Container className="pt-[calc(var(--nav-h)+64px)] pb-10">
          <ErrorState
            title="Could not load trending titles"
            message={trendingError.message}
            onRetry={retryTrending}
          />
        </Container>
      ) : (
        <Hero
          items={heroItems}
          onWatchTrailer={handleWatchTrailer}
          trailerLoading={trailerLoading}
        />
      )}

      <ProviderRail />

      <RowSection
        eyebrow="What everyone is watching"
        title="Trending This Week"
        items={trending?.results ?? []}
        loading={trendingLoading}
      />

      <RowSection
        eyebrow="Big screen favourites"
        title="Popular Movies"
        fetcher={(signal) => tmdb.popularMovies(1, signal)}
        viewAllHref="/movies"
        mediaType="movie"
      />

      <RowSection
        eyebrow="Critically acclaimed"
        title="Top Rated Movies"
        fetcher={(signal) => tmdb.topRatedMovies(1, signal)}
        viewAllHref="/movies?sort=top_rated"
        mediaType="movie"
      />

      <RowSection
        eyebrow="Binge-worthy"
        title="Popular TV Shows"
        fetcher={(signal) => tmdb.popularTv(1, signal)}
        viewAllHref="/tv"
        mediaType="tv"
      />

      <RowSection
        eyebrow="Fresh episodes daily"
        title="Airing Today"
        fetcher={(signal) => tmdb.airingTodayTv(1, signal)}
        viewAllHref="/tv?sort=on_the_air"
        mediaType="tv"
      />

      <RowSection
        eyebrow="Coming soon"
        title="Upcoming Movies"
        fetcher={(signal) => tmdb.upcomingMovies(1, signal)}
        viewAllHref="/movies?sort=upcoming"
        mediaType="movie"
      />

      <GenreExplorer />

      {trailer && (
        <TrailerModal
          videoKey={trailer.video.key}
          title={trailer.title}
          onClose={() => setTrailer(null)}
        />
      )}
    </div>
  )
}
