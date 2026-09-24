import { Link } from 'react-router-dom'
import { imageUrl } from '../../api/tmdb'
import { getInitials, getMediaType, getTitle, getYear } from '../../utils/format'
import RatingPill from '../ui/RatingPill'
import { PlayIcon } from '../ui/icons'

export default function MediaCard({
  item,
  mediaType,
  showType = false,
  className = '',
}) {
  const type = mediaType || getMediaType(item)
  const title = getTitle(item)
  const year = getYear(item)
  const poster = imageUrl(item.poster_path, 'w342')

  return (
    <Link to={`/${type}/${item.id}`} className={`group flex flex-col gap-3 ${className}`}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-surface-muted shadow-soft transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-card">
        {poster ? (
          <img
            src={poster}
            srcSet={`${imageUrl(item.poster_path, 'w342')} 342w, ${imageUrl(
              item.poster_path,
              'w500'
            )} 500w`}
            sizes="(max-width: 420px) 44vw, (max-width: 900px) 30vw, 200px"
            alt={`${title} poster`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className="grid size-full place-items-center bg-gradient-to-br from-ink to-flame"
            aria-hidden="true"
          >
            <span className="font-display text-3xl font-semibold tracking-[0.06em] text-cloud/90">
              {getInitials(title)}
            </span>
          </div>
        )}

        <span
          className="absolute inset-0 bg-gradient-to-t from-ink/82 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        <RatingPill score={item.vote_average} className="absolute top-2.5 right-2.5" />

        {showType && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-cloud/95 px-2.5 py-1 text-[0.66rem] font-bold tracking-[0.09em] text-ink uppercase">
            {type === 'tv' ? 'Series' : 'Movie'}
          </span>
        )}

        <span
          className="absolute bottom-3.5 left-1/2 inline-flex w-max max-w-[calc(100%-20px)] -translate-x-1/2 translate-y-3 items-center gap-[7px] rounded-full bg-cloud/95 px-4 py-2 text-[0.78rem] font-bold whitespace-nowrap text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden="true"
        >
          <PlayIcon className="size-3 shrink-0 text-flame" />
          View details
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="line-clamp-2 font-sans text-[0.95rem] leading-[1.35] font-semibold text-foreground transition-colors duration-300 group-hover:text-flame">
          {title}
        </h3>
        <p className="mt-0.5 text-[0.82rem] text-muted">{year || '—'}</p>
      </div>
    </Link>
  )
}
