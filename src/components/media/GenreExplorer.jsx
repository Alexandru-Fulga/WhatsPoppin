import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { tmdb } from '../../api/tmdb'
import { useFetch } from '../../hooks/useFetch'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import Eyebrow from '../ui/Eyebrow'
import MediaTypeToggle from '../ui/MediaTypeToggle'

export default function GenreExplorer() {
  const [mediaType, setMediaType] = useState('movie')
  const { data, loading } = useFetch(
    (signal) => tmdb.genres(mediaType, signal),
    [mediaType]
  )
  const listRef = useRef(null)
  const genres = useMemo(() => data?.genres ?? [], [data])

  useEffect(() => {
    const list = listRef.current
    if (!list || !genres.length || prefersReducedMotion()) {
      return undefined
    }

    const pills = list.querySelectorAll('.genre-pill')
    if (!pills.length) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        pills,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: list,
            start: 'top 92%',
            once: true,
          },
        }
      )
    }, list)

    return () => ctx.revert()
  }, [genres])

  return (
    <section className="mx-auto mt-18 w-full max-w-[1288px] px-4 sm:px-6">
      <div className="panel-warm relative overflow-hidden rounded-3xl p-11 shadow-card max-[720px]:px-5.5 max-[720px]:py-7">
        <span
          className="pointer-events-none absolute -top-[140px] -right-[100px] size-[340px] rounded-full bg-[radial-gradient(circle,rgba(238,238,238,0.16)_0%,rgba(238,238,238,0)_70%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mb-7 flex items-end justify-between gap-6 max-[720px]:flex-col max-[720px]:items-start">
          <div className="flex flex-col gap-2.5">
            <Eyebrow light>Browse by genre</Eyebrow>
            <h2 className="text-[clamp(1.5rem,2.6vw,2.05rem)] text-cloud">
              Find your next obsession
            </h2>
          </div>

          <MediaTypeToggle
            value={mediaType}
            onChange={setMediaType}
            tone="dark"
          />
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5" ref={listRef}>
          {loading
            ? Array.from({ length: 12 }).map((_, index) => (
                <span
                  className="skeleton skeleton-dark h-9 w-24 rounded-full"
                  key={index}
                />
              ))
            : genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/${
                    mediaType === 'movie' ? 'movies' : 'tv'
                  }?genre=${genre.id}`}
                  className="genre-pill rounded-full border border-cloud/30 bg-cloud/12 px-4 py-2 text-[0.86rem] font-medium text-cloud transition-all duration-300 hover:-translate-y-0.5 hover:border-cloud/50 hover:bg-cloud/20"
                >
                  {genre.name}
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}
