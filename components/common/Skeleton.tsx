type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-surface-muted ${className}`}
      aria-hidden="true"
    />
  );
}

/** Poster-style card matching MovieCard (image + title + meta) */
export function MovieCardSkeleton() {
  return (
    <div className="flex w-full flex-col">
      <Skeleton className="aspect-[2/3] w-full rounded-[16px]" />
      <div className="space-y-2 pt-3">
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <Skeleton className="h-3 w-2/3 rounded-md" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function HorizontalRailSkeleton({
  count = 6,
  cardWidth = "w-[190px]",
}: {
  count?: number;
  cardWidth?: string;
}) {
  return (
    <div className="hide-scrollbar flex gap-5 overflow-hidden pb-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`shrink-0 ${cardWidth}`}>
          <MovieCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function CategoryRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="min-h-[200px] rounded-2xl md:min-h-[220px]" />
      ))}
    </div>
  );
}

export function ArtistRowSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex w-[108px] shrink-0 flex-col items-center">
          <Skeleton className="size-[96px] rounded-full sm:size-[112px]" />
          <Skeleton className="mt-3 h-3 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="w-[260px] shrink-0">
      <Skeleton className="aspect-[4/5] rounded-[16px]" />
      <div className="space-y-2 pt-3">
        <Skeleton className="h-3 w-1/2 rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <Skeleton className="h-3 w-2/3 rounded-md" />
      </div>
    </div>
  );
}

export function LandingSkeleton() {
  return (
    <div className="flex flex-col gap-10 py-6 md:py-8">
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8 lg:px-12">
          <Skeleton className="mb-4 h-8 w-40 rounded-lg" />
          <HorizontalRailSkeleton />
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8 lg:px-12">
          <CategoryRowSkeleton />
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8 lg:px-12">
          <Skeleton className="mb-4 h-8 w-36 rounded-lg" />
          <HorizontalRailSkeleton />
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8 lg:px-12">
          <Skeleton className="mb-4 h-8 w-48 rounded-lg" />
          <ArtistRowSkeleton />
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8 lg:px-12">
          <Skeleton className="mb-4 h-8 w-52 rounded-lg" />
          <div className="hide-scrollbar flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <VideoCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/** @deprecated kept for imports that still reference spotlight layout */
export function MovieSpotlightSkeleton() {
  return (
    <div className="hide-scrollbar flex gap-5 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  );
}
