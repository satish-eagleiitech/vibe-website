"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/** Sharp photo centered with blurred same-image bleed on the edges */
function BlurredEdgeImage({
  src,
  alt,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface-muted">
      <Image
        src={src}
        alt=""
        fill
        aria-hidden
        className="scale-150 object-cover blur-2xl saturate-150"
        sizes={sizes}
        priority={priority}
      />
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

/** Photo strip with a full-screen viewer behind "See all photos" */
export function DetailGallery({ title, images }: { title: string; images: string[] }) {
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;

  return (
    <>
      <GalleryStrip title={title} images={images} onShowAll={() => setOpen(true)} />
      {open ? (
        <AllPhotosModal title={title} images={images} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}

function GalleryStrip({
  title,
  images,
  onShowAll,
}: {
  title: string;
  images: string[];
  onShowAll: () => void;
}) {
  const tiles = [
    images[0],
    images[1] ?? images[0],
    images[2] ?? images[0],
    images[3] ?? images[0],
  ].filter(Boolean) as string[];

  return (
    <div className="mt-4 grid h-[200px] grid-cols-[1.35fr_0.85fr] gap-2 min-[480px]:h-[240px] sm:h-[280px] sm:grid-cols-[1.45fr_repeat(3,minmax(0,0.7fr))] md:h-[320px] md:gap-2.5">
      {tiles.map((src, index) => {
        const isLast = index === tiles.length - 1;
        const hideOnMobile = index === 1 || index === 2;
        return (
          <button
            key={`${src}-blur-${index}`}
            type="button"
            onClick={onShowAll}
            className={`relative overflow-hidden rounded-2xl bg-surface-muted ${
              hideOnMobile ? "hidden sm:block" : ""
            }`}
            aria-label={isLast ? "See all photos" : `View photo ${index + 1}`}
          >
            <BlurredEdgeImage
              src={src}
              alt={index === 0 ? title : ""}
              sizes={index === 0 ? "(max-width: 640px) 60vw, 40vw" : "18vw"}
              priority={index === 0}
            />
            {isLast ? (
              <span className="absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-lg bg-surface px-2.5 py-1.5 text-[11px] font-bold text-text shadow-[0_4px_14px_rgba(17,24,39,0.18)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.45)] sm:bottom-3.5 sm:px-3 sm:text-[12px]">
                See all photos
                <ChevronRight className="size-3.5" strokeWidth={2.5} />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function AllPhotosModal({
  title,
  images,
  onClose,
}: {
  title: string;
  images: string[];
  onClose: () => void;
}) {
  const uniqueImages = useMemo(() => {
    const seen = new Set<string>();
    return images.filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const count = uniqueImages.length;
  const activeSrc = uniqueImages[activeIndex] ?? uniqueImages[0];

  function goPrev() {
    if (count < 2) return;
    setActiveIndex((index) => (index - 1 + count) % count);
  }

  function goNext() {
    if (count < 2) return;
    setActiveIndex((index) => (index + 1) % count);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          count < 2 ? index : (index - 1 + count) % count,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (count < 2 ? index : (index + 1) % count));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const thumb = document.getElementById(`detail-gallery-thumb-${activeIndex}`);
    thumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  if (!activeSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
    >
      <div className="flex shrink-0 items-center justify-end px-4 pt-4 md:px-6 md:pt-5">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white/90 transition-opacity hover:opacity-80 md:text-[15px]"
        >
          <X className="size-4 md:size-5" strokeWidth={2.25} />
          Close
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 md:px-20 lg:px-24">
        {count > 1 ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/30 text-white transition-colors hover:bg-black/50 md:left-5 md:size-12"
            aria-label="Previous photo"
          >
            <ChevronLeft className="size-5 md:size-6" strokeWidth={1.75} />
          </button>
        ) : null}

        <div className="relative h-[min(62vh,680px)] w-full max-w-5xl overflow-hidden rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] md:rounded-2xl">
          <BlurredEdgeImage
            key={activeSrc}
            src={activeSrc}
            alt={`${title} photo ${activeIndex + 1}`}
            priority
            sizes="(max-width: 1024px) 90vw, 960px"
          />
        </div>

        {count > 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/30 text-white transition-colors hover:bg-black/50 md:right-5 md:size-12"
            aria-label="Next photo"
          >
            <ChevronRight className="size-5 md:size-6" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      <div className="shrink-0 px-4 pt-4 pb-5 md:px-6 md:pb-7">
        <div className="hide-scrollbar mx-auto flex w-fit max-w-full gap-2 overflow-x-auto px-1 md:gap-2.5">
          {uniqueImages.map((src, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={`${src}-thumb-${index}`}
                id={`detail-gallery-thumb-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-14 w-[72px] shrink-0 overflow-hidden rounded-lg md:h-16 md:w-20 md:rounded-xl ${
                  active
                    ? "outline outline-2 outline-offset-2 outline-white"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View photo ${index + 1}`}
                aria-current={active ? "true" : undefined}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
