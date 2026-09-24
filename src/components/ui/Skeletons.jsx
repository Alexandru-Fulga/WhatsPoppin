export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      <div className="skeleton aspect-[2/3] rounded-2xl" />
      <div className="skeleton h-3.5 w-[82%] rounded-md" />
      <div className="skeleton h-3.5 w-[45%] rounded-md" />
    </div>
  )
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(172px,1fr))] gap-x-[22px] gap-y-[30px] max-[900px]:grid-cols-[repeat(auto-fill,minmax(142px,1fr))] max-[900px]:gap-x-3.5 max-[900px]:gap-y-6 max-[420px]:grid-cols-2"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}

export function RowSkeleton({ count = 7 }) {
  return (
    <div className="relative" aria-hidden="true">
      <div className="no-scrollbar -mx-1 -mt-1.5 flex gap-5 overflow-x-auto px-1 pt-1.5 pb-6 max-[900px]:gap-3.5">
        {Array.from({ length: count }).map((_, index) => (
          <div className="w-[clamp(152px,17vw,198px)] flex-none" key={index}>
            <CardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DetailsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="bg-ink pt-[calc(var(--nav-h)+48px)] pb-14">
        <div className="mx-auto flex w-full max-w-[1288px] items-start gap-10 px-4 sm:px-6 max-[720px]:flex-col">
          <div className="skeleton skeleton-dark aspect-[2/3] w-[260px] shrink-0 rounded-2xl max-[720px]:w-[180px]" />
          <div className="flex flex-1 flex-col gap-4 pt-3">
            <div className="skeleton skeleton-dark h-[46px] w-[64%] rounded-xl" />
            <div className="skeleton skeleton-dark h-5 w-[38%] rounded-lg" />
            <div className="skeleton skeleton-dark h-4 w-[86%] rounded-md" />
            <div className="skeleton skeleton-dark h-4 w-[74%] rounded-md" />
            <div className="skeleton skeleton-dark h-[52px] w-[52%] rounded-full" />
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1288px] flex-col gap-6 px-4 pt-14 sm:px-6">
        <div className="skeleton h-[180px] rounded-2xl" />
        <div className="skeleton h-[180px] rounded-2xl" />
      </div>
    </div>
  )
}
