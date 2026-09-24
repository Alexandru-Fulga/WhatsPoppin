import { CloseIcon, SearchIcon } from '../ui/icons'

export default function SearchInput({
  value,
  onChange,
  onFocus,
  onKeyDown,
  variant = 'light',
  placeholder = 'Search movies, series, people…',
  ariaLabel = 'Search movies, TV shows and people',
  autoFocus = false,
}) {
  const dark = variant === 'dark'

  const inputClasses = dark
    ? 'border-cloud/30 bg-cloud/10 text-cloud placeholder:text-cloud/70 backdrop-blur-md focus:border-cloud/60 focus:bg-cloud/20 focus:ring-4 focus:ring-cloud/10'
    : 'border-border bg-surface text-foreground placeholder:text-muted focus:border-flame focus:ring-4 focus:ring-flame/10'

  const iconClasses = dark ? 'text-cloud/75' : 'text-muted'

  const clearClasses = dark
    ? 'text-cloud/75 hover:bg-cloud/15 hover:text-white'
    : 'text-muted hover:bg-foreground/5 hover:text-foreground'

  return (
    <>
      <SearchIcon
        className={`pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 transition-colors ${iconClasses}`}
      />
      <input
        className={`w-full rounded-full border-[1.5px] py-3 pr-11 pl-11 text-[0.92rem] transition-all duration-300 focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${inputClasses}`}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          className={`absolute top-1/2 right-3 grid size-[26px] -translate-y-1/2 place-items-center rounded-full transition-colors duration-200 ${clearClasses}`}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </>
  )
}
