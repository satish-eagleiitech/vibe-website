"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Play, X } from "lucide-react";
import type { MovieVideo } from "@/types/movie";

type MovieHeroPosterProps = {
  title: string;
  posterUrl: string;
  trailer?: MovieVideo;
};

export function MovieHeroPoster({ title, posterUrl, trailer }: MovieHeroPosterProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const frame =
    "relative w-[132px] shrink-0 overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/20 sm:w-[180px] md:w-[220px] lg:w-[250px]";

  const poster = (
    <div className="relative aspect-[2/3] bg-black/40">
      <Image
        src={posterUrl}
        alt=""
        fill
        priority
        className="object-cover transition-[scale] duration-500 ease-out group-hover:scale-105"
        sizes="250px"
      />
    </div>
  );

  const triggerClass = `group ${frame} block cursor-pointer text-left transition-shadow duration-300 hover:shadow-[0_22px_50px_rgba(0,0,0,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`;

  const overlay = (
    <>
      <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35 group-focus-visible:bg-black/35" />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
        <span className="grid size-12 scale-75 place-items-center rounded-full bg-white/95 text-black opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-[opacity,scale] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 sm:size-14 md:size-16 [@media(hover:none)]:scale-90 [@media(hover:none)]:opacity-90">
          <Play className="ml-0.5 size-5 fill-current sm:size-6 md:size-7" />
        </span>
        <span className="translate-y-1 text-[12px] font-bold tracking-wide text-white opacity-0 drop-shadow transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:text-[13px]">
          Watch trailer
        </span>
      </span>
    </>
  );

  if (!trailer) {
    return (
      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} official trailer`)}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`Find ${title} trailer on YouTube`}
        className={triggerClass}
      >
        {poster}
        {overlay}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play ${title} trailer`}
        className={triggerClass}
      >
        {poster}
        {overlay}
      </button>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label={`${title} trailer`}
            >
              <div
                className="w-full max-w-[min(64rem,calc((100dvh-7rem)*16/9))]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-3 flex items-center justify-between gap-3 text-white">
                  <p className="min-w-0 truncate text-[14px] font-bold md:text-[16px]">
                    {trailer.name || `${title} trailer`}
                  </p>
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={trailer.watchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold transition-colors hover:bg-white/20 sm:inline-flex"
                    >
                      <ExternalLink className="size-3.5" />
                      Watch on YouTube
                    </a>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close trailer"
                      className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
                    title={trailer.name || `${title} trailer`}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="absolute inset-0 size-full"
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
