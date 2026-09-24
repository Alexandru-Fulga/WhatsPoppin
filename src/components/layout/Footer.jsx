import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-10 bg-gradient-to-b from-ink to-ink-deep pt-[72px] pb-9 text-cloud">
      <Container className="flex justify-between gap-16 max-[860px]:flex-col max-[860px]:gap-11">
        <div className="flex max-w-[360px] flex-col gap-4.5">
          <Logo light />
          <p className="text-[0.92rem] leading-[1.7] text-cloud/70">
            Find what&rsquo;s poppin&rsquo; in movies and TV — ratings, cast,
            trailers and every platform where you can stream it.
          </p>
        </div>

        <div className="flex gap-[72px] max-[860px]:gap-12">
          <div className="flex flex-col gap-2.5">
            <h4 className="mb-1.5 font-sans text-[0.78rem] font-bold tracking-[0.16em] text-cloud uppercase">
              Browse
            </h4>
            <Link to="/movies" className="text-[0.92rem] text-cloud/70 transition-all duration-300 hover:translate-x-0.5 hover:text-white">
              Movies
            </Link>
            <Link to="/tv" className="text-[0.92rem] text-cloud/70 transition-all duration-300 hover:translate-x-0.5 hover:text-white">
              TV Shows
            </Link>
            <Link to="/search" className="text-[0.92rem] text-cloud/70 transition-all duration-300 hover:translate-x-0.5 hover:text-white">
              Search
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <h4 className="mb-1.5 font-sans text-[0.78rem] font-bold tracking-[0.16em] text-cloud uppercase">
              Discover
            </h4>
            <Link to="/movies?sort=top_rated" className="text-[0.92rem] text-cloud/70 transition-all duration-300 hover:translate-x-0.5 hover:text-white">
              Top rated movies
            </Link>
            <Link to="/movies?sort=upcoming" className="text-[0.92rem] text-cloud/70 transition-all duration-300 hover:translate-x-0.5 hover:text-white">
              Coming soon
            </Link>
            <Link to="/tv?sort=on_the_air" className="text-[0.92rem] text-cloud/70 transition-all duration-300 hover:translate-x-0.5 hover:text-white">
              Currently airing
            </Link>
          </div>
        </div>
      </Container>

      <Container className="mt-14 flex items-center justify-between gap-5 border-t border-cloud/15 pt-6.5 max-[860px]:flex-col max-[860px]:items-start">
        <p className="text-[0.8rem] text-cloud/55">
          © {new Date().getFullYear()} Whats-Poppin. All rights reserved.
        </p>
        <p className="max-w-[560px] text-right text-[0.8rem] text-cloud/55 max-[860px]:text-left">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB. Streaming availability data provided by JustWatch.
        </p>
      </Container>
    </footer>
  )
}
