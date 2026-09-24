# Whats-Poppin

A modern movie & TV discovery app. Search for any title and see everything that matters: rating, release date, runtime/seasons, genres, cast & crew, official trailers, streaming availability by region, episode guides, recommendations and more.

Built with React + Vite, animated with GSAP, and powered by the [TMDB API](https://developer.themoviedb.org/docs). Streaming availability data is provided by JustWatch via TMDB.

## Features

- **Hero carousel** of this week's trending titles with animated backdrop crossfades
- **Instant search** with debounced suggestions across movies, TV shows and people (keyboard navigable)
- **Browse** movies and TV shows with genre filters, sorting and pagination
- **Details pages** with score ring, certification, budget/revenue, production info, keywords, cast, season & episode guides, video gallery and similar titles
- **Where to watch** with a region selector and provider logos (stream / rent / buy)
- **Person pages** with biography, personal details and full filmography
- **GSAP animations** throughout: hero timelines, scroll reveals, page transitions and modal choreography
- **Light & dark theme** with a navbar toggle, system-preference detection and persistence
- Responsive layout, skeleton loading states and reduced-motion support

## Design

- Palette: `#1D1616`, `#8E1616`, `#D84040`, `#EEEEEE`
- Fonts: [Inter](https://fonts.google.com/specimen/Inter) (UI/body) and [Lora](https://fonts.google.com/specimen/Lora) (display titles)
- Styling: [Tailwind CSS v4](https://tailwindcss.com) with CSS-first `@theme` tokens in `src/styles/global.css`

## Getting started

```bash
npm install
npm run dev
```

### Environment

The app reads the TMDB API key from an environment variable. Create a `.env` file in the project root:

```bash
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

Get a free key at https://www.themoviedb.org/settings/api. See `.env.example` for reference. `.env` files are gitignored.

### Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start the dev server     |
| `npm run build`   | Production build         |
| `npm run preview` | Preview the built app    |
| `npm run lint`    | Lint with Oxlint         |

## Project structure

```
src/
├── api/                 # TMDB client, image helpers, discover params
├── components/
│   ├── layout/          # Navbar, Footer, Logo, page transitions
│   ├── media/           # Hero, MediaCard/Grid/Row, CastList, WatchProviders, GenreExplorer
│   ├── search/          # SearchBar with instant suggestions
│   └── ui/              # Button, Chip, Container, Reveal, ScoreRing, modal, skeletons, icons
├── hooks/               # useFetch, useDebounce, useDocumentTitle
├── lib/                 # GSAP + ScrollTrigger setup
├── pages/               # Home, Browse, Search, Details, Person, NotFound
├── styles/global.css    # Tailwind v4 theme tokens, base styles, composed styles
└── utils/               # Formatting and TMDB response helpers
```

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
