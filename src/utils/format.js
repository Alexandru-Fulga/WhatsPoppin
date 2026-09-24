export function getTitle(item) {
  return (
    item?.title ||
    item?.name ||
    item?.original_title ||
    item?.original_name ||
    'Untitled'
  )
}

export function getReleaseDate(item) {
  return item?.release_date || item?.first_air_date || ''
}

export function getYear(item) {
  const date = getReleaseDate(item)
  return date ? date.slice(0, 4) : ''
}

export function getMediaType(item) {
  if (item?.media_type) return item.media_type
  return item?.first_air_date ? 'tv' : 'movie'
}

export function formatDate(dateString, options = {}) {
  if (!dateString) return '—'
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

export function formatRuntime(minutes) {
  if (!minutes || minutes <= 0) return '—'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function formatMoney(amount) {
  if (!amount || amount <= 0) return '—'
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatScore(score) {
  if (!score || Number.isNaN(score)) return 'NR'
  return score.toFixed(1)
}

export function ratingTone(score) {
  if (!score) return 'neutral'
  if (score >= 7.5) return 'great'
  if (score >= 6) return 'good'
  return 'low'
}

export function ratingColor(score) {
  const tone = ratingTone(score)
  if (tone === 'great') return 'var(--color-jade)'
  if (tone === 'good') return 'var(--color-gold)'
  if (tone === 'low') return 'var(--color-flame)'
  return 'var(--color-stone)'
}

export function getTrailer(videos = []) {
  const youtube = videos.filter(
    (video) => video.site === 'YouTube' && video.key
  )
  return (
    youtube.find((video) => video.type === 'Trailer' && video.official) ||
    youtube.find((video) => video.type === 'Trailer') ||
    youtube.find((video) => video.type === 'Teaser') ||
    youtube[0] ||
    null
  )
}

export function getYoutubeVideos(videos = []) {
  return videos.filter((video) => video.site === 'YouTube' && video.key)
}

export function getDirectors(credits) {
  if (!credits?.crew) return []
  return credits.crew.filter((person) => person.job === 'Director')
}

export function getCertification(details, mediaType, region = 'US') {
  if (mediaType === 'movie') {
    const entry = details?.release_dates?.results?.find(
      (item) => item.iso_3166_1 === region
    )
    const certified = entry?.release_dates?.find(
      (release) => release.certification
    )
    return certified?.certification || null
  }

  const entry = details?.content_ratings?.results?.find(
    (item) => item.iso_3166_1 === region
  )
  return entry?.rating || null
}

export function getCast(details, mediaType) {
  if (mediaType === 'tv' && details?.aggregate_credits?.cast?.length) {
    return details.aggregate_credits.cast
  }
  return details?.credits?.cast ?? []
}

export function getCrew(details, mediaType) {
  if (mediaType === 'tv' && details?.aggregate_credits?.crew?.length) {
    return details.aggregate_credits.crew
  }
  return details?.credits?.crew ?? []
}

export function getCreators(details) {
  return details?.created_by ?? []
}

export function getSeasonsSummary(details) {
  const count = details?.number_of_seasons
  const episodes = details?.number_of_episodes
  if (!count) return '—'
  const seasonLabel = count === 1 ? '1 Season' : `${count} Seasons`
  return episodes ? `${seasonLabel} · ${episodes} Episodes` : seasonLabel
}

export function getInitials(title = '') {
  return title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function dedupeById(items = []) {
  const seen = new Set()
  return items.filter((item) => {
    const key = `${item.media_type ?? ''}-${item.id}`
    if (!item?.id || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function sortByDateDesc(items = []) {
  return [...items].sort((a, b) => {
    const dateA = getReleaseDate(a) || '0000-00-00'
    const dateB = getReleaseDate(b) || '0000-00-00'
    return dateB.localeCompare(dateA)
  })
}
