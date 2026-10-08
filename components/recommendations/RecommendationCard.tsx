import Image from "next/image";
import Link from "next/link";
import type { Recommendation } from "@/types/recommendation";

const toneClass = {
  accent: "text-accent",
  teal: "text-[#00647E]",
} as const;

type RecommendationCardProps = {
  item: Recommendation;
};

export function RecommendationCard({ item }: RecommendationCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-sm">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span
          className={`text-[11px] font-bold ${toneClass[item.tone ?? "accent"]}`}
        >
          {item.eyebrow}
        </span>
        <h4 className="truncate text-base font-bold text-text">{item.title}</h4>
        <span className="text-xs text-text-secondary">{item.meta}</span>
        <Link
          href={item.href}
          className="mt-1 text-[11px] font-bold text-accent hover:underline"
        >
          {item.cta}
        </Link>
      </div>
    </article>
  );
}
