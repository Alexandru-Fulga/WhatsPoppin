import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { imageUrl, tmdb } from '../api/tmdb'
import MediaGrid from '../components/media/MediaGrid'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Eyebrow from '../components/ui/Eyebrow'
import SectionHeader from '../components/ui/SectionHeader'
import { ErrorState } from '../components/ui/States'
import { ExternalLinkIcon } from '../components/ui/icons'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import {
  dedupeById,
  formatDate,
  getInitials,
  sortByDateDesc,
} from '../utils/format'

export default function Person() {
  const { id } = useParams()
  const { data: person, loading, error, retry } = useFetch(
    (signal) => tmdb.person(id, signal),
    [id]
  )
  const [expanded, setExpanded] = useState(false)

  useDocumentTitle(person?.name)

  if (loading) {
    return (
      <Container className="flex gap-11 pt-[calc(var(--nav-h)+60px)] pb-15 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-6.5">
        <div className="skeleton aspect-[1/1.15] w-[220px] shrink-0 rounded-2xl max-[720px]:w-[170px]" />
        <div className="flex flex-1 flex-col gap-4 pt-5">
          <div className="skeleton h-10 w-[55%] rounded-xl" />
          <div className="skeleton h-[18px] w-[30%] rounded-md" />
          <div className="skeleton h-3.5 w-[90%] rounded-md" />
          <div className="skeleton h-3.5 w-[80%] rounded-md" />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="pt-[calc(var(--nav-h)+56px)]">
        <ErrorState
          title="Could not load this person"
          message={error.message}
          onRetry={retry}
        />
      </Container>
    )
  }

  if (!person) return null

  const credits = sortByDateDesc(
    dedupeById(
      (person.combined_credits?.cast ?? []).filter(
        (credit) => credit.poster_path
      )
    )
  )

  const external = person.external_ids ?? {}
  const links = [
    external.imdb_id && {
      href: `https://www.imdb.com/name/${external.imdb_id}`,
      label: 'IMDb',
    },
    external.instagram_id && {
      href: `https://instagram.com/${external.instagram_id}`,
      label: 'Instagram',
    },
    external.twitter_id && {
      href: `https://x.com/${external.twitter_id}`,
      label: 'X',
    },
  ].filter(Boolean)

  const bio = person.biography ?? ''
  const showToggle = bio.length > 700

  return (
    <div>
      <header className="panel-warm relative overflow-hidden">
        <span
          className="pointer-events-none absolute -top-[180px] -right-[120px] size-[420px] rounded-full bg-[radial-gradient(circle,rgba(238,238,238,0.14)_0%,rgba(238,238,238,0)_70%)]"
          aria-hidden="true"
        />

        <Container className="relative z-2 flex items-center gap-11 pt-[calc(var(--nav-h)+60px)] pb-15 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-6.5">
          <div className="grid aspect-[1/1.15] w-[220px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-cloud/12 shadow-float max-[720px]:w-[170px]">
            {person.profile_path ? (
              <img
                src={imageUrl(person.profile_path, 'w300')}
                alt={person.name}
                className="size-full object-cover"
              />
            ) : (
              <span className="font-display text-[2.4rem] font-semibold text-cloud/85" aria-hidden="true">
                {getInitials(person.name)}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-3.5">
            <Eyebrow light>Person</Eyebrow>
            <h1 className="text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.1] text-cloud">
              {person.name}
            </h1>
            {person.known_for_department && (
              <p className="text-base font-medium text-cloud/80">
                {person.known_for_department}
              </p>
            )}

            <ul className="flex flex-col gap-2">
              {person.birthday && (
                <li className="flex gap-2.5 text-[0.9rem] text-cloud/85">
                  <strong className="min-w-[46px] font-semibold text-cloud">
                    Born
                  </strong>
                  <span>
                    {formatDate(person.birthday)}
                    {person.place_of_birth
                      ? ` · ${person.place_of_birth}`
                      : ''}
                  </span>
                </li>
              )}
              {person.deathday && (
                <li className="flex gap-2.5 text-[0.9rem] text-cloud/85">
                  <strong className="min-w-[46px] font-semibold text-cloud">
                    Died
                  </strong>
                  <span>{formatDate(person.deathday)}</span>
                </li>
              )}
            </ul>

            {links.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-2.5">
                {links.map((link) => (
                  <Button
                    key={link.label}
                    variant="ghost"
                    size="sm"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                    <ExternalLinkIcon />
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Container>
      </header>

      <Container className="pt-14">
        {bio && (
          <section className="mb-14 max-w-[860px]">
            <SectionHeader
              eyebrow="Biography"
              title={`About ${person.name.split(' ')[0]}`}
            />
            <p className={`text-base leading-[1.8] text-soft ${expanded ? '' : 'line-clamp-4'}`}>
              {bio}
            </p>
            {showToggle && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4.5"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? 'Show less' : 'Read more'}
              </Button>
            )}
          </section>
        )}

        <section className="mt-12">
          <SectionHeader eyebrow="Known for" title="Filmography" />
          {credits.length > 0 ? (
            <MediaGrid items={credits.slice(0, 30)} />
          ) : (
            <p className="text-muted">No credits available.</p>
          )}
        </section>
      </Container>
    </div>
  )
}
