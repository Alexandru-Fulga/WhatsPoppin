import MediaCard from './MediaCard'
import Reveal from '../ui/Reveal'
import { GridSkeleton } from '../ui/Skeletons'

export default function MediaGrid({
  items = [],
  loading = false,
  skeletonCount = 12,
  mediaType,
  showType = false,
}) {
  if (loading) {
    return <GridSkeleton count={skeletonCount} />
  }

  return (
    <Reveal
      className="grid grid-cols-[repeat(auto-fill,minmax(172px,1fr))] gap-x-[22px] gap-y-[30px] max-[900px]:grid-cols-[repeat(auto-fill,minmax(142px,1fr))] max-[900px]:gap-x-3.5 max-[900px]:gap-y-6 max-[420px]:grid-cols-2"
      stagger={0.055}
      y={26}
    >
      {items.map((item) => (
        <MediaCard
          key={`${item.media_type ?? mediaType ?? ''}-${item.id}`}
          item={item}
          mediaType={mediaType}
          showType={showType}
        />
      ))}
    </Reveal>
  )
}
