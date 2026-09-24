import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { imageUrl, tmdb } from '../api/tmdb'
import CastList from '../components/media/CastList'
import MediaRow from '../components/media/MediaRow'
import WatchProviders from '../components/media/WatchProviders'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import Container from '../components/ui/Container'
import Eyebrow from '../components/ui/Eyebrow'
import ScoreRing from '../components/ui/ScoreRing'
import RatingPill from '../components/ui/RatingPill'
import SectionHeader from '../components/ui/SectionHeader'
import { DetailsSkeleton } from '../components/ui/Skeletons'
import { ErrorState } from '../components/ui/States'
import TrailerModal from '../components/ui/TrailerModal'
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  ExternalLinkIcon,
  LinkIcon,
  PlayIcon,
  StarIcon,
} from '../components/ui/icons'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import {
  dedupeById,
  formatDate,
  formatMoney,
  formatNumber,
  formatRuntime,
  getCast,
  getCertification,
  getCreators,
  getDirectors,
  getInitials,
  getReleaseDate,
  getSeasonsSummary,
  getTitle,
  getTrailer,
  getYear,
  getYoutubeVideos,
} from '../utils/format'

function languageName(code) {
  if (!code) return '—'
  try {
    return (
      new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ??
      code.toUpperCase()
    )
  } catch {
    return code.toUpperCase()
  }
}

function FactsList({ details, mediaType, directors, creators }) {
  const facts = [
    ['Status', details.status],
    [
      mediaType === 'movie' ? 'Release date' : 'First aired',
      formatDate(getReleaseDate(details)),
    ],
    ['Original language', languageName(details.original_language)],
  ]

  if (mediaType === 'movie') {
    facts.push(['Runtime', formatRuntime(details.runtime)])
    facts.push(['Budget', formatMoney(details.budget)])
    facts.push(['Revenue', formatMoney(details.revenue)])
  } else {
    facts.push(['Seasons', getSeasonsSummary(details)])
    if (details.networks?.length) {
      facts.push([
        'Networks',
        details.networks.map((item) => item.name).join(', '),
      ])
    }
  }

  if (directors.length) {
    facts.push(['Director', directors.map((item) => item.name).join(', ')])
  }

  if (creators.length) {
    facts.push(['Created by', creators.map((item) => item.name).join(', ')])
  }

  if (details.production_countries?.length) {
    facts.push([
      'Countries',
      details.production_countries.map((item) => item.name).join(', '),
    ])
  }

  if (details.production_companies?.length) {
    facts.push([
      'Production',
      details.production_companies
        .slice(0, 4)
        .map((item) => item.name)
        .join(', '),
    ])
  }

  if (details.spoken_languages?.length) {
    facts.push([
      'Spoken languages',
      details.spoken_languages
        .map((item) => item.english_name ?? item.name)
        .join(', '),
    ])
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5.5 shadow-soft">
      <h2 className="mb-4 text-[1.25rem]">Details</h2>
      <dl className="flex flex-col">
        {facts
          .filter(([, value]) => value && value !== '—')
          .map(([label, value]) => (
            <div
              className="flex justify-between gap-4.5 border-b border-dashed border-border py-[11px] last:border-0 last:pb-0 max-[640px]:flex-col max-[640px]:gap-1"
              key={label}
            >
              <dt className="shrink-0 text-[0.84rem] font-semibold text-muted">
                {label}
              </dt>
              <dd className="text-right text-[0.88rem] leading-[1.5] text-foreground max-[640px]:text-left">
                {value}
              </dd>
            </div>
          ))}
      </dl>
    </section>
  )
}

function SeasonsSection({ details }) {
  const seasons = (details.seasons ?? []).filter(
    (season) => season.season_number > 0
  )
  const [selected, setSelected] = useState(seasons[0]?.season_number ?? 1)

  const { data, loading } = useFetch(
    (signal) => tmdb.season(details.id, selected, signal),
    [details.id, selected],
    { enabled: seasons.length > 0 }
  )

  if (!seasons.length) return null

  const episodes = data?.episodes ?? []

  return (
    <section className="min-w-0">
      <SectionHeader eyebrow="Episode guide" title="Seasons & Episodes">
        <label>
          <span className="sr-only">Select a season</span>
          <select
            className="max-w-[260px] cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-[0.85rem] font-medium text-foreground transition-all focus:border-flame focus:ring-3 focus:ring-flame/15 focus:outline-none"
            value={selected}
            onChange={(event) => setSelected(Number(event.target.value))}
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.season_number}>
                {season.name} · {season.episode_count} episodes
              </option>
            ))}
          </select>
        </label>
      </SectionHeader>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="grid grid-cols-[218px_minmax(0,1fr)] gap-5 rounded-2xl border border-border bg-surface p-4 shadow-soft max-[640px]:grid-cols-1"
              key={index}
            >
              <div className="skeleton aspect-video w-full rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <div className="skeleton h-[18px] w-[45%] rounded-md" />
                <div className="skeleton h-3.5 w-[30%] rounded-md" />
                <div className="skeleton h-3.5 w-[85%] rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {episodes.map((episode) => (
            <li
              className="grid grid-cols-[218px_minmax(0,1fr)] gap-5 rounded-2xl border border-border bg-surface p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card max-[640px]:grid-cols-1 max-[640px]:gap-3"
              key={episode.id}
            >
              {episode.still_path ? (
                <img
                  className="aspect-video w-full rounded-xl bg-surface-muted object-cover"
                  src={imageUrl(episode.still_path, 'w300')}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-border to-surface-muted" />
              )}
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="flex gap-2.5 font-sans text-[0.98rem] leading-[1.4] font-semibold">
                    <span className="font-bold text-flame">
                      {String(episode.episode_number).padStart(2, '0')}
                    </span>
                    {episode.name}
                  </h4>
                  {episode.vote_average > 0 && (
                    <RatingPill score={episode.vote_average} />
                  )}
                </div>
                <p className="text-[0.8rem] text-muted">
                  {formatDate(episode.air_date)}
                  {episode.runtime ? ` · ${formatRuntime(episode.runtime)}` : ''}
                </p>
                {episode.overview && (
                  <p className="line-clamp-3 text-[0.88rem] leading-[1.6] text-soft">
                    {episode.overview}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function VideosSection({ videos, onPlay }) {
  if (!videos.length) return null

  return (
    <section className="min-w-0">
      <SectionHeader eyebrow="Watch" title="Videos & Trailers" />
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[22px]">
        {videos.map((video) => (
          <li key={video.id}>
            <button
              type="button"
              className="group flex w-full flex-col gap-2.5 text-left"
              onClick={() => onPlay(video)}
            >
              <span className="relative block aspect-video overflow-hidden rounded-xl bg-ink shadow-soft">
                <img
                  src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <PlayIcon className="size-12 rounded-full bg-cloud/95 p-[15px] text-flame shadow-soft transition-transform duration-300 group-hover:scale-110" />
                </span>
              </span>
              <span className="line-clamp-2 text-[0.9rem] leading-[1.45] font-semibold text-foreground">
                {video.name}
              </span>
              <span className="text-[0.72rem] font-bold tracking-[0.1em] text-muted uppercase">
                {video.type}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Details({ mediaType }) {
  const { id } = useParams()
  const { data: details, loading, error, retry } = useFetch(
    (signal) => tmdb.details(mediaType, id, signal),
    [mediaType, id]
  )

  const [activeVideo, setActiveVideo] = useState(null)
  const [copied, setCopied] = useState(false)

  useDocumentTitle(details ? getTitle(details) : null)

  if (loading) return <DetailsSkeleton />

  if (error) {
    return (
      <Container className="pt-[calc(var(--nav-h)+56px)]">
        <ErrorState
          title="Could not load this title"
          message={error.message}
          onRetry={retry}
        />
      </Container>
    )
  }

  if (!details) return null

  const title = getTitle(details)
  const year = getYear(details)
  const certification = getCertification(details, mediaType)
  const trailer = getTrailer(details.videos?.results)
  const videos = getYoutubeVideos(details.videos?.results).slice(0, 6)
  const cast = getCast(details, mediaType)
  const directors = getDirectors(details.credits)
  const creators = getCreators(details)
  const keywords = details.keywords?.keywords ?? details.keywords?.results ?? []
  const backdrop = imageUrl(
    details.backdrop_path || details.poster_path,
    'w1280'
  )
  const poster = imageUrl(details.poster_path, 'w500')

  const similar = dedupeById(details.similar?.results ?? []).filter(
    (item) => item.id !== details.id && item.poster_path
  )
  const recommendations = dedupeById(
    details.recommendations?.results ?? []
  ).filter((item) => item.id !== details.id && item.poster_path)

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      setCopied(false)
    }
  }

  return (
    <div>
      <header className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0" aria-hidden="true">
          {backdrop && (
            <img
              src={backdrop}
              alt=""
              fetchPriority="high"
              className="size-full object-cover object-[center_18%] opacity-60"
            />
          )}
          <div className="scrim-details absolute inset-0" />
        </div>

        <Container className="relative z-2 flex gap-[46px] pt-[calc(var(--nav-h)+60px)] pb-[68px] max-[820px]:flex-col max-[820px]:gap-7 max-[820px]:pb-[52px]">
          <div className="grid aspect-[2/3] w-[272px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-ink-deep shadow-float max-[820px]:w-[190px]">
            {poster ? (
              <img src={poster} alt={`${title} poster`} className="size-full object-cover" />
            ) : (
              <span className="font-display text-[2.6rem] font-semibold tracking-[0.06em] text-cloud/85">
                {getInitials(title)}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-[18px] pt-2.5 max-[820px]:pt-0">
            <Eyebrow light>
              {mediaType === 'tv' ? 'TV Series' : 'Movie'}
              {year ? ` · ${year}` : ''}
            </Eyebrow>

            <h1 className="text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.08] text-cloud">
              {title}
            </h1>

            {details.tagline && (
              <p className="font-display text-[1.05rem] italic text-cloud/70">
                {details.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6">
              <ScoreRing
                score={details.vote_average}
                label="User score"
                size={78}
                dark
              />
              <div className="flex flex-col gap-[9px]">
                <span className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-cloud/85 [&_svg]:size-[15px] [&_svg]:text-cloud/55">
                  <CalendarIcon />
                  {formatDate(getReleaseDate(details))}
                </span>
                <span className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-cloud/85 [&_svg]:size-[15px] [&_svg]:text-cloud/55">
                  <ClockIcon />
                  {mediaType === 'movie'
                    ? formatRuntime(details.runtime)
                    : getSeasonsSummary(details)}
                </span>
                <span className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-cloud/85 [&_svg]:size-[15px] [&_svg]:text-cloud/55">
                  <StarIcon />
                  {formatNumber(details.vote_count)} votes
                </span>
                {certification && (
                  <span className="w-fit rounded-md border border-cloud/40 px-2 py-0.5 text-[0.78rem] font-semibold text-cloud/90">
                    {certification}
                  </span>
                )}
              </div>
            </div>

            {details.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    as={Link}
                    to={`/${
                      mediaType === 'movie' ? 'movies' : 'tv'
                    }?genre=${genre.id}`}
                    dark
                  >
                    {genre.name}
                  </Chip>
                ))}
              </div>
            )}

            <p className="max-w-[740px] text-base leading-[1.75] text-cloud/85">
              {details.overview ||
                'No overview available for this title yet.'}
            </p>

            <div className="mt-1 flex flex-wrap gap-3">
              {trailer && (
                <Button
                  onClick={() =>
                    setActiveVideo({ key: trailer.key, name: trailer.name })
                  }
                >
                  <PlayIcon />
                  Watch trailer
                </Button>
              )}
              {details.homepage && (
                <Button variant="ghost" href={details.homepage} target="_blank" rel="noreferrer">
                  <ExternalLinkIcon />
                  Official site
                </Button>
              )}
              <Button variant="ghost" onClick={handleShare}>
                {copied ? <CheckIcon /> : <LinkIcon />}
                {copied ? 'Link copied' : 'Share'}
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <Container className="mt-16 grid grid-cols-[minmax(0,1fr)_356px] gap-12 max-[1080px]:grid-cols-1 max-[1080px]:gap-14">
        <div className="flex min-w-0 flex-col gap-[60px]">
          <section className="min-w-0">
            <SectionHeader eyebrow="Top billed" title="Cast" />
            <CastList cast={cast} />
          </section>

          {mediaType === 'tv' && <SeasonsSection details={details} />}

          <VideosSection videos={videos} onPlay={setActiveVideo} />

          {recommendations.length > 0 && (
            <section className="min-w-0">
              <SectionHeader
                eyebrow="Because you're viewing this"
                title="Recommended"
              />
              <MediaRow items={recommendations.slice(0, 14)} label="Recommended" />
            </section>
          )}

          {similar.length > 0 && (
            <section className="min-w-0">
              <SectionHeader eyebrow="Keep exploring" title="More like this" />
              <MediaRow items={similar.slice(0, 14)} label="More like this" />
            </section>
          )}
        </div>

        <aside className="flex min-w-0 flex-col gap-6">
          <WatchProviders details={details} />

          <FactsList
            details={details}
            mediaType={mediaType}
            directors={directors}
            creators={creators}
          />

          {keywords.length > 0 && (
            <section className="rounded-2xl border border-border bg-surface p-5.5 shadow-soft">
              <h2 className="mb-4 text-[1.25rem]">Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {keywords.slice(0, 14).map((keyword) => (
                  <Chip
                    key={keyword.id}
                    as={Link}
                    to={`/search?q=${encodeURIComponent(keyword.name)}`}
                    soft
                  >
                    {keyword.name}
                  </Chip>
                ))}
              </div>
            </section>
          )}
        </aside>
      </Container>

      {activeVideo && (
        <TrailerModal
          videoKey={activeVideo.key}
          title={activeVideo.name || title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  )
}
