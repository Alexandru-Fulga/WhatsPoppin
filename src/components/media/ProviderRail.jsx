import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FEATURED_PROVIDERS, imageUrl, tmdb } from '../../api/tmdb'
import { useFetch } from '../../hooks/useFetch'
import Container from '../ui/Container'
import MediaTypeToggle from '../ui/MediaTypeToggle'
import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'

export default function ProviderRail() {
  const [mediaType, setMediaType] = useState('movie')
  const { data, loading } = useFetch(
    (signal) => tmdb.watchProviders(mediaType, undefined, signal),
    [mediaType]
  )

  const providers = useMemo(() => {
    const byId = new Map(
      (data?.results ?? []).map((provider) => [provider.provider_id, provider])
    )
    return FEATURED_PROVIDERS.map((featured) => {
      const match = byId.get(featured.id)
      return match ? { ...match, displayName: featured.name } : null
    }).filter(Boolean)
  }, [data])

  const browseHref = (id) =>
    `/${mediaType === 'movie' ? 'movies' : 'tv'}?provider=${id}`

  return (
    <section className="mt-18 max-sm:mt-13">
      <Container>
        <SectionHeader
          eyebrow="Streaming"
          title="Browse by streaming service"
        >
          <MediaTypeToggle value={mediaType} onChange={setMediaType} />
        </SectionHeader>

        {loading ? (
          <div className="flex flex-wrap gap-x-3 gap-y-5">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                className="flex w-[88px] flex-col items-center gap-2.5"
                key={index}
              >
                <div className="skeleton size-16 rounded-2xl" />
                <div className="skeleton h-3 w-14 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <Reveal
            className="flex flex-wrap gap-x-3 gap-y-5"
            stagger={0.035}
            y={18}
          >
            {providers.map((provider) => (
              <Link
                key={provider.provider_id}
                to={browseHref(provider.provider_id)}
                className="group flex w-[88px] flex-col items-center gap-2.5"
              >
                <span className="grid size-16 place-items-center overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:border-flame/60 group-hover:shadow-card">
                  <img
                    src={imageUrl(provider.logo_path, 'w92')}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </span>
                <span className="text-center text-[0.78rem] leading-[1.3] font-medium text-soft transition-colors duration-300 group-hover:text-flame">
                  {provider.displayName}
                </span>
              </Link>
            ))}
          </Reveal>
        )}
      </Container>
    </section>
  )
}
