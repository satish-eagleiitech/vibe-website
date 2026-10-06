"use client";

import Image from "next/image";
import type { ReactNode } from "react";

export function DetailPhotoGrid({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const hero = images[0];
  const tiles = images.slice(1, 5);

  return (
    <div className="grid h-[280px] grid-cols-1 gap-2 sm:h-[340px] md:h-[420px] md:grid-cols-2">
      <div className="relative overflow-hidden rounded-2xl bg-surface-muted">
        <Image
          src={hero}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="hidden grid-cols-2 grid-rows-2 gap-2 md:grid">
        {Array.from({ length: 4 }).map((_, index) => {
          const src = tiles[index] ?? hero;
          return (
            <div
              key={`${src}-${index}`}
              className="relative overflow-hidden rounded-2xl bg-surface-muted"
            >
              <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
              {index === 3 ? (
                <span className="absolute right-3 bottom-3 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold text-text">
                  Show all photos
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DetailSection({
  prefix,
  id,
  title,
  children,
}: {
  prefix: string;
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={`${prefix}-${id}`}
      className="scroll-mt-[calc(var(--vybe-header-h)+5rem)] pt-10"
    >
      <h2 className="mb-4 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function DetailHighlightCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4">
      <p className="text-[14px] font-extrabold text-text">{title}</p>
      <p className="mt-1.5 text-[13px] leading-5 text-text-secondary">{text}</p>
    </div>
  );
}

export function DetailOfferCard({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl bg-accent-soft px-4 py-5">
      <p className="text-[18px] font-extrabold tracking-tight text-text">{title}</p>
      <p className="mt-1 text-[13px] text-text-secondary">{detail}</p>
    </div>
  );
}

export function DetailActionChip({
  href,
  icon,
  label,
  onClick,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const className =
    "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-bold text-text";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {icon}
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      className={className}
    >
      {icon}
      {label}
    </a>
  );
}

export function buildGallery(primary: string, extras: string[]): string[] {
  const seen = new Set<string>([primary]);
  const images = [primary];
  for (const url of extras) {
    if (images.length >= 5) break;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    images.push(url);
  }
  while (images.length < 5) images.push(primary);
  return images;
}
