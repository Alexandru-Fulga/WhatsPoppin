import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import { formatScore, ratingColor } from '../../utils/format'

export default function ScoreRing({ score = 0, size = 74, label, dark = false }) {
  const progressRef = useRef(null)
  const radius = (size - 9) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(score ?? 0, 0), 10)
  const progress = clamped / 10
  const offset = circumference * (1 - progress)
  const color = ratingColor(score)

  useEffect(() => {
    const circle = progressRef.current
    if (!circle || prefersReducedMotion()) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        circle,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: offset,
          duration: 1.4,
          ease: 'power2.out',
          delay: 0.25,
        }
      )
    })

    return () => ctx.revert()
  }, [circumference, offset])

  return (
    <div className="inline-flex shrink-0 flex-col items-center gap-1.5">
      <div
        className="relative"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`User score ${formatScore(score)} out of 10`}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={dark ? 'rgba(238, 238, 238, 0.28)' : 'var(--ring-track)'}
            strokeWidth="5"
          />
          <circle
            ref={progressRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span
          className={`absolute inset-0 grid place-items-center font-sans font-extrabold tracking-tight ${
            dark ? 'text-cloud' : 'text-foreground'
          }`}
          style={{ fontSize: size * 0.27 }}
        >
          {formatScore(score)}
        </span>
      </div>
      {label && (
        <span
          className={`text-[0.72rem] font-semibold tracking-[0.08em] uppercase ${
            dark ? 'text-cloud/65' : 'text-muted'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  )
}
