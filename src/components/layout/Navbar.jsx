import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import SearchBar from '../search/SearchBar'
import Container from '../ui/Container'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { CloseIcon, MenuIcon } from '../ui/icons'

const LINKS = [
  { to: '/movies', label: 'Movies' },
  { to: '/tv', label: 'TV Shows' },
  { to: '/search', label: 'Search' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled && !menuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen)
    return () => document.body.classList.remove('no-scroll')
  }, [menuOpen])

  const linkClasses = ({ isActive }) =>
    `rounded-full px-3.5 py-2 text-[0.92rem] font-semibold transition-colors duration-300 ${
      transparent
        ? isActive
          ? 'bg-cloud/15 text-white'
          : 'text-cloud/90 hover:bg-cloud/15 hover:text-white'
        : isActive
          ? 'bg-flame/10 text-flame'
          : 'text-soft hover:bg-flame/10 hover:text-flame'
    }`

  const iconButtonClasses = transparent
    ? 'border-cloud/30 bg-cloud/15 text-cloud backdrop-blur-md hover:bg-cloud/25'
    : 'border-border bg-surface text-foreground hover:border-flame hover:text-flame'

  return (
    <header className="fixed inset-x-0 top-0 z-90">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border-b border-border bg-background/90 shadow-[0_6px_24px_rgba(29,22,22,0.05)] backdrop-blur-xl transition-opacity duration-300 dark:shadow-[0_6px_24px_rgba(0,0,0,0.4)] ${
          transparent ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <Container className="relative z-10 flex h-[var(--nav-h)] items-center gap-[26px]">
        <Logo light={transparent} />

        <nav
          className="flex items-center gap-1 max-[980px]:hidden"
          aria-label="Primary"
        >
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="w-[clamp(220px,32vw,400px)] max-[980px]:hidden">
            <SearchBar variant={transparent ? 'dark' : 'light'} />
          </div>

          <ThemeToggle transparent={transparent} />

          <button
            type="button"
            className={`grid size-[42px] place-items-center rounded-xl border transition-colors duration-300 min-[981px]:hidden ${iconButtonClasses}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <CloseIcon className="size-[22px]" />
            ) : (
              <MenuIcon className="size-[22px]" />
            )}
          </button>
        </div>
      </Container>

      <div
        className={`fixed inset-x-0 top-[var(--nav-h)] max-h-[calc(100vh-var(--nav-h))] overflow-y-auto border-b border-border bg-background px-4 pt-4.5 pb-7 shadow-card transition-all duration-300 min-[981px]:hidden ${
          menuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-3.5 opacity-0'
        }`}
      >
        <SearchBar onNavigate={() => setMenuOpen(false)} />
        <nav className="mt-4 flex flex-col gap-2" aria-label="Mobile">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl border px-4.5 py-3.5 font-semibold transition-colors duration-300 ${
                  isActive
                    ? 'border-flame bg-flame/10 text-flame'
                    : 'border-border bg-surface text-foreground'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
