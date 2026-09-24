import { Analytics } from '@vercel/analytics/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import PageTransition from './components/layout/PageTransition'
import ScrollToTop from './components/layout/ScrollToTop'
import Browse from './pages/Browse'
import Details from './pages/Details'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Person from './pages/Person'
import Search from './pages/Search'

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <PageTransition routeKey={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Browse mediaType="movie" />} />
          <Route path="/tv" element={<Browse mediaType="tv" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<Details mediaType="movie" />} />
          <Route path="/tv/:id" element={<Details mediaType="tv" />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      <Footer />
      {import.meta.env.PROD && (
        <Analytics
          route={location.pathname}
          path={`${location.pathname}${location.search}`}
        />
      )}
    </>
  )
}
