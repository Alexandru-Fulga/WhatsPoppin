import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { imageUrl } from '../../api/tmdb'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import { getInitials } from '../../utils/format'
import Button from '../ui/Button'

function CastCard({ person, expanded }) {
  const profile = imageUrl(person.profile_path, 'w185')
  const roles =
    person.roles?.map((role) => role.character).filter(Boolean) ?? []
  const character = person.character || roles.join(', ') || '—'
  const episodes = person.total_episode_count

  return (
    <li
      className={
        expanded ? '' : 'w-[134px] flex-none max-[640px]:w-[112px]'
      }
    >
      <Link to={`/person/${person.id}`} className="group block">
        <div className="relative mb-2.5 aspect-[1/1.15] w-full overflow-hidden rounded-2xl bg-surface-muted shadow-soft transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-card">
          {profile ? (
            <img
              src={profile}
              alt={person.name}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          ) : (
            <span
              className="grid size-full place-items-center bg-gradient-to-br from-border to-surface-muted text-[1.4rem] font-bold tracking-[0.04em] text-flame"
              aria-hidden="true"
            >
              {getInitials(person.name)}
            </span>
          )}
        </div>
        <strong className="block text-[0.88rem] leading-[1.35] font-semibold text-foreground transition-colors duration-300 group-hover:text-flame">
          {person.name}
        </strong>
        <span className="line-clamp-2 mt-0.5 text-[0.78rem] leading-[1.4] text-muted">
          {character}
          {episodes > 1 ? ` · ${episodes} episodes` : ''}
        </span>
      </Link>
    </li>
  )
}

export default function CastList({ cast = [], limit = 20 }) {
  const [expanded, setExpanded] = useState(false)
  const listRef = useRef(null)
  const hasMore = cast.length > limit

  useEffect(() => {
    if (!expanded || !listRef.current || prefersReducedMotion()) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.from(listRef.current, {
        opacity: 0,
        y: 14,
        duration: 0.45,
        ease: 'power2.out',
      })
    })

    return () => ctx.revert()
  }, [expanded])

  if (!cast.length) {
    return <p className="text-muted">No cast information available.</p>
  }

  const visible = expanded ? cast : cast.slice(0, limit)

  return (
    <div className="flex w-full flex-col items-start">
      <ul
        ref={listRef}
        className={
          expanded
            ? 'grid w-full grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-x-3.5 gap-y-[22px] max-[640px]:grid-cols-[repeat(auto-fill,minmax(96px,1fr))] max-[640px]:gap-x-2.5 max-[640px]:gap-y-[18px]'
            : 'no-scrollbar -mx-1 -mt-1 flex w-full gap-[18px] overflow-x-auto px-1 pt-1 pb-5 max-[640px]:gap-3.5'
        }
        aria-label={expanded ? 'Full cast list' : 'Top billed cast'}
      >
        {visible.map((person, index) => (
          <CastCard key={`${person.id}-${index}`} person={person} expanded={expanded} />
        ))}
      </ul>

      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4.5"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `Show all ${cast.length} cast members`}
        </Button>
      )}
    </div>
  )
}
