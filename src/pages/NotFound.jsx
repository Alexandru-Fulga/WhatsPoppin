import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')

  return (
    <Container className="flex flex-col items-center gap-4 pt-[calc(var(--nav-h)+96px)] pb-20 text-center">
      <span
        className="bg-gradient-to-br from-flame to-foreground bg-clip-text font-display text-[clamp(5rem,16vw,10rem)] leading-none font-bold text-transparent italic"
        aria-hidden="true"
      >
        404
      </span>
      <h1 className="text-[clamp(1.6rem,3.4vw,2.4rem)]">
        This page has left the cinema
      </h1>
      <p className="max-w-[480px] leading-[1.7] text-muted">
        The page you are looking for does not exist or may have been moved.
        Let&rsquo;s get you back to something worth watching.
      </p>
      <div className="mt-2.5 flex flex-wrap justify-center gap-3">
        <Button to="/">Back to home</Button>
        <Button variant="outline" to="/movies">
          Browse movies
        </Button>
      </div>
    </Container>
  )
}
