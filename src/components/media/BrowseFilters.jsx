import { useMemo } from 'react'
import { BROWSE_SORTS, imageUrl } from '../../api/tmdb'
import Chip from '../ui/Chip'
import FilterDropdown from '../ui/FilterDropdown'
import {
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  SortIcon,
  TagIcon,
} from '../ui/icons'

const FIRST_YEAR = 1950

export default function BrowseFilters({
  mediaType,
  genres = [],
  genre,
  sort,
  year,
  provider,
  activeProvider,
  onChange,
  onClear,
}) {
  const sortOptions = BROWSE_SORTS[mediaType]
  const sortLabel = sortOptions.find((option) => option.value === sort)?.label
  const genreLabel = genres.find((item) => String(item.id) === genre)?.name

  const years = useMemo(() => {
    const current = new Date().getFullYear()
    return Array.from(
      { length: current - FIRST_YEAR + 1 },
      (_, index) => current - index
    )
  }, [])

  const hasFilters = Boolean(genre || year || provider) || sort !== 'popular'

  return (
    <div className="sticky top-[var(--nav-h)] z-20 mb-7 flex flex-wrap items-center gap-2.5 border-b border-border bg-background/92 py-3.5 backdrop-blur-md">
      {provider && (
        <Chip
          as="button"
          type="button"
          active
          className="gap-2"
          aria-label={`Remove ${
            activeProvider?.provider_name ?? 'provider'
          } filter`}
          onClick={() => onChange('provider', '')}
        >
          {activeProvider?.logo_path && (
            <img
              src={imageUrl(activeProvider.logo_path, 'w45')}
              alt=""
              className="size-4 rounded-[4px]"
            />
          )}
          {activeProvider?.provider_name ?? 'Selected service'}
          <CloseIcon className="size-3.5" />
        </Chip>
      )}

      <FilterDropdown
        label="Genres"
        value={genreLabel}
        icon={TagIcon}
        active={Boolean(genre)}
        panelClassName="w-[min(420px,calc(100vw-40px))]"
      >
        {({ close }) => (
          <div className="flex max-h-[min(70vh,420px)] flex-wrap content-start gap-2 overflow-y-auto">
            <Chip
              as="button"
              type="button"
              active={!genre}
              onClick={() => {
                onChange('genre', '')
                close()
              }}
            >
              All genres
            </Chip>
            {genres.map((item) => (
              <Chip
                key={item.id}
                as="button"
                type="button"
                active={String(item.id) === genre}
                onClick={() => {
                  onChange('genre', String(item.id))
                  close()
                }}
              >
                {item.name}
              </Chip>
            ))}
          </div>
        )}
      </FilterDropdown>

      <FilterDropdown
        label="Year"
        value={year}
        icon={CalendarIcon}
        active={Boolean(year)}
        panelClassName="w-[min(300px,calc(100vw-40px))]"
      >
        {({ close }) => (
          <div className="grid max-h-[min(60vh,320px)] grid-cols-4 gap-1.5 overflow-y-auto pr-0.5">
            <Chip
              as="button"
              type="button"
              active={!year}
              className="col-span-4 justify-center"
              onClick={() => {
                onChange('year', '')
                close()
              }}
            >
              Any year
            </Chip>
            {years.map((item) => (
              <Chip
                key={item}
                as="button"
                type="button"
                active={String(item) === year}
                className="justify-center"
                onClick={() => {
                  onChange('year', String(item))
                  close()
                }}
              >
                {item}
              </Chip>
            ))}
          </div>
        )}
      </FilterDropdown>

      <FilterDropdown
        label="Sort"
        value={sortLabel}
        icon={SortIcon}
        active={sort !== 'popular'}
        panelClassName="w-[min(250px,calc(100vw-40px))]"
      >
        {({ close }) => (
          <div className="flex flex-col">
            {sortOptions.map((option) => {
              const isActive = option.value === sort
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange('sort', option.value)
                    close()
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-[0.88rem] transition-colors duration-200 ${
                    isActive
                      ? 'bg-flame/10 font-semibold text-flame'
                      : 'text-soft hover:bg-surface-muted'
                  }`}
                >
                  {option.label}
                  {isActive && <CheckIcon className="size-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        )}
      </FilterDropdown>

      {hasFilters && (
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.82rem] font-semibold text-muted transition-colors duration-300 hover:text-flame"
          onClick={onClear}
        >
          <CloseIcon className="size-3.5" />
          Clear filters
        </button>
      )}
    </div>
  )
}
