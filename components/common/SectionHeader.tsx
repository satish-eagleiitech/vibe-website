import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  eyebrowClassName?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  action?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  eyebrowClassName = "text-accent",
  title,
  description,
  href,
  linkLabel,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <span
            className={`mb-1 block text-[12px] font-extrabold uppercase tracking-[0.16em] ${eyebrowClassName}`}
          >
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-[28px] font-extrabold leading-9 tracking-tight text-text md:text-[34px] md:leading-[42px]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[15px] text-text-secondary">{description}</p>
        ) : null}
      </div>
      {action}
      {href && linkLabel ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-[15px] font-bold text-accent transition-colors hover:text-[#E70052]"
        >
          {linkLabel}
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
