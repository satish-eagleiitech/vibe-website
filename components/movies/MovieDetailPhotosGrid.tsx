import { Camera } from "lucide-react";
import { Container } from "@/components/common/Container";
import type { MovieImage } from "@/types/movie";

type MovieDetailPhotosGridProps = {
  title: string;
  images: MovieImage[];
};

export function MovieDetailPhotosGrid({
  title,
  images,
}: MovieDetailPhotosGridProps) {
  if (images.length === 0) return null;

  const tiles = images.slice(0, 24);

  return (
    <section className="bg-bg py-10 md:py-14">
      <Container>
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[12px] font-bold tracking-wide text-text uppercase">
            <Camera className="size-4 text-accent" />
            Photos
          </span>
        </div>
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
          {tiles.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-[#ececee] sm:mb-4 dark:bg-[#1c1c20]"
            >
              {/* Natural size so posters and stills stay whole, with no crop. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt || `${title} photo ${index + 1}`}
                className="block h-auto w-full"
                loading={index < 3 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        <p className="mt-8 text-center font-serif text-[18px] italic text-text-secondary md:text-[20px]">
          Now showing on VYBE — book your seats.
        </p>
      </Container>
    </section>
  );
}
