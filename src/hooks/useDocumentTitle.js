import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return
    const previous = document.title
    document.title = `${title} | Whats-Poppin`
    return () => {
      document.title = previous
    }
  }, [title])
}
