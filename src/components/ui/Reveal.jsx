import { useCallback, useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  y = 32,
  delay = 0,
  duration = 0.9,
  stagger = 0,
  start = 'top 88%',
  deps = [],
  ref: forwardedRef,
  ...rest
}) {
  const innerRef = useRef(null)

  const setRef = useCallback(
    (node) => {
      innerRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef]
  )

  useEffect(() => {
    const el = innerRef.current
    if (!el || prefersReducedMotion()) return undefined

    const targets = stagger ? Array.from(el.children) : el
    if (!targets || (Array.isArray(targets) && targets.length === 0)) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [y, delay, duration, stagger, start, ...deps])

  return (
    <Tag ref={setRef} className={className} {...rest}>
      {children}
    </Tag>
  )
}
