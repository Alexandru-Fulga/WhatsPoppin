import { formatScore, ratingTone } from '../../utils/format'
import { StarIcon } from './icons'

const TONES = {
  great: 'text-jade',
  good: 'text-gold',
  low: 'text-flame',
  neutral: 'text-cloud',
}

export default function RatingPill({ score, className = '' }) {
  if (!score || score <= 0) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg bg-ink/80 px-2.5 py-1 text-[0.8rem] leading-none font-bold tracking-wide text-white backdrop-blur-sm ${className}`}
    >
      <StarIcon className={`size-3 ${TONES[ratingTone(score)]}`} />
      {formatScore(score)}
    </span>
  )
}
