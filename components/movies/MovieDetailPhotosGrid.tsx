import Image from "next/image";
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

  const tiles = images.slice(0, 9);
  while (tiles.length < 9 && images[0]) {
    tiles.push(images[tiles.length % images.length]);
  }

  return (
    <section className="bg-bg py-10 md:py-14">
      <Container>
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[12px] font-bold tracking-wide text-text uppercase">
            <Camera className="size-4 text-accent" />
            Photos
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {tiles.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-muted sm:aspect-[16/10]"
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} still ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <span className="h-1 w-8 rounded-full bg-accent" />
          <span className="h-1 w-3 rounded-full bg-border" />
          <span className="h-1 w-3 rounded-full bg-border" />
        </div>
        <p className="mt-8 text-center font-serif text-[18px] italic text-text-secondary md:text-[20px]">
          Now showing on VYBE — book your seats.
        </p>
      </Container>
    </section>
  );
}
