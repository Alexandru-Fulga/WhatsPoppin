const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const TMDB_IMAGE_BASE = IMAGE_BASE

const APPEND_TO_RESPONSE = {
  movie:
    'credits,videos,watch/providers,similar,recommendations,external_ids,keywords,images,release_dates',
  tv: 'credits,aggregate_credits,videos,watch/providers,similar,recommendations,external_ids,keywords,images,content_ratings',
}

export function imageUrl(path, size = 'w500') {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

async function request(path, params = {}, signal) {
  if (!API_KEY) {
    throw new Error(
      'Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file.'
    )
  }

  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'en-US')

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url, { signal })

  if (!response.ok) {
    const error = new Error(
      response.status === 404
        ? 'We could not find what you were looking for.'
        : `TMDB request failed (${response.status}). Please try again.`
    )
    error.status = response.status
    throw error
  }

  return response.json()
}

export const tmdb = {
  trending: (mediaType = 'all', timeWindow = 'week', page = 1, signal) =>
    request(`/trending/${mediaType}/${timeWindow}`, { page }, signal),

  popularMovies: (page = 1, signal) =>
    request('/movie/popular', { page }, signal),

  topRatedMovies: (page = 1, signal) =>
    request('/movie/top_rated', { page }, signal),

  upcomingMovies: (page = 1, signal) =>
    request('/movie/upcoming', { page }, signal),

  nowPlayingMovies: (page = 1, signal) =>
    request('/movie/now_playing', { page }, signal),

  popularTv: (page = 1, signal) => request('/tv/popular', { page }, signal),

  topRatedTv: (page = 1, signal) => request('/tv/top_rated', { page }, signal),

  airingTodayTv: (page = 1, signal) =>
    request('/tv/airing_today', { page }, signal),

  onTheAirTv: (page = 1, signal) => request('/tv/on_the_air', { page }, signal),

  searchMulti: (query, page = 1, signal) =>
    request('/search/multi', { query, page, include_adult: false }, signal),

  searchMovie: (query, page = 1, signal) =>
    request('/search/movie', { query, page, include_adult: false }, signal),

  searchTv: (query, page = 1, signal) =>
    request('/search/tv', { query, page, include_adult: false }, signal),

  details: (mediaType, id, signal) =>
    request(
      `/${mediaType}/${id}`,
      { append_to_response: APPEND_TO_RESPONSE[mediaType] },
      signal
    ),

  season: (tvId, seasonNumber, signal) =>
    request(`/tv/${tvId}/season/${seasonNumber}`, {}, signal),

  person: (id, signal) =>
    request(
      `/person/${id}`,
      { append_to_response: 'combined_credits,external_ids,images' },
      signal
    ),

  genres: (mediaType, signal) =>
    request(`/genre/${mediaType}/list`, {}, signal),

  discover: (mediaType, params = {}, signal) =>
    request(`/discover/${mediaType}`, params, signal),

  watchProviders: (mediaType, region = DEFAULT_REGION, signal) =>
    request(`/watch/providers/${mediaType}`, { watch_region: region }, signal),
}

export function getWatchData(details, region = 'US') {
  const results = details?.['watch/providers']?.results
  if (!results) return null
  return results[region] ?? null
}

export const DEFAULT_REGION = 'US'

export const REGIONS = [
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'ES', label: 'Spain' },
  { code: 'IT', label: 'Italy' },
  { code: 'BR', label: 'Brazil' },
  { code: 'MX', label: 'Mexico' },
  { code: 'IN', label: 'India' },
  { code: 'JP', label: 'Japan' },
]

/* Popular subscription / free streaming services (US catalogue). Only the
   ones available in the selected region are rendered, so this list degrades
   gracefully for other regions. */
export const FEATURED_PROVIDERS = [
  { id: 8, name: 'Netflix' },
  { id: 9, name: 'Prime Video' },
  { id: 337, name: 'Disney+' },
  { id: 1899, name: 'Max' },
  { id: 15, name: 'Hulu' },
  { id: 350, name: 'Apple TV+' },
  { id: 2303, name: 'Paramount+' },
  { id: 386, name: 'Peacock' },
  { id: 283, name: 'Crunchyroll' },
  { id: 73, name: 'Tubi' },
  { id: 300, name: 'Pluto TV' },
  { id: 43, name: 'Starz' },
]

export const BROWSE_SORTS = {
  movie: [
    { value: 'popular', label: 'Most popular' },
    { value: 'top_rated', label: 'Top rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'upcoming', label: 'Upcoming' },
  ],
  tv: [
    { value: 'popular', label: 'Most popular' },
    { value: 'top_rated', label: 'Top rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'on_the_air', label: 'On the air' },
  ],
}

export function buildDiscoverParams(
  mediaType,
  { genre, sort, provider, region = DEFAULT_REGION } = {}
) {
  const params = { page: 1, include_adult: false }
  const today = new Date().toISOString().slice(0, 10)

  if (genre) params.with_genres = genre

  if (provider) {
    params.with_watch_providers = provider
    params.watch_region = region
    params.with_watch_monetization_types = 'flatrate|free|ads'
  }

  switch (sort) {
    case 'top_rated':
      params.sort_by = 'vote_average.desc'
      params['vote_count.gte'] = 300
      break
    case 'newest':
      params.sort_by = mediaType === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc'
      if (mediaType === 'movie') params['primary_release_date.lte'] = today
      else params['first_air_date.lte'] = today
      break
    case 'upcoming':
      params.sort_by = 'popularity.desc'
      params['primary_release_date.gte'] = today
      break
    case 'on_the_air':
      params.sort_by = 'popularity.desc'
      params['air_date.gte'] = today
      break
    case 'popular':
    default:
      params.sort_by = 'popularity.desc'
      break
  }

  return params
}
