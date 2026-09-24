import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

export default function PageTransition({ children, routeKey }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'transform',
        }
      )
    })
    return () => ctx.revert()
  }, [routeKey])

  return (
    <div ref={ref} className="min-h-[70vh] pb-24">
      {children}
    </div>
  )
}
