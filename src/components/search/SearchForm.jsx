import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchInput from './SearchInput'

const DEBOUNCE_MS = 450

/**
 * Search field for the search page. Unlike the navbar search bar (which shows
 * a dropdown of suggestions), this one feeds the results grid: the typed term
 * is pushed to the `q` URL param which drives the fetch, so results update
 * live and stay ordered by relevance.
 */
export default function SearchForm({ initialQuery = '', autoFocus = false }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [value, setValue] = useState(initialQuery)
  const paramsRef = useRef(searchParams)
  const lastCommittedRef = useRef(initialQuery)

  useEffect(() => {
    paramsRef.current = searchParams
  }, [searchParams])

  // Sync the field when the URL changes from outside (back/forward, nav links)
  // without clobbering what the user is currently typing.
  useEffect(() => {
    if (initialQuery === lastCommittedRef.current) return
    lastCommittedRef.current = initialQuery
    setValue(initialQuery)
  }, [initialQuery])

  // Live search: commit the typed term after a short pause.
  useEffect(() => {
    const term = value.trim()

    const timer = setTimeout(() => {
      const params = new URLSearchParams(paramsRef.current)
      if (term === (params.get('q') ?? '')) return

      if (term) params.set('q', term)
      else params.delete('q')

      lastCommittedRef.current = term
      setSearchParams(params, { replace: true })
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [value, setSearchParams])

  const handleSubmit = (event) => {
    event.preventDefault()

    const term = value.trim()
    const params = new URLSearchParams(paramsRef.current)

    if (term) params.set('q', term)
    else params.delete('q')

    lastCommittedRef.current = term
    setSearchParams(params, { replace: true })
  }

  return (
    <form className="relative w-full" role="search" onSubmit={handleSubmit}>
      <SearchInput
        value={value}
        onChange={setValue}
        variant="light"
        autoFocus={autoFocus}
      />
    </form>
  )
}
