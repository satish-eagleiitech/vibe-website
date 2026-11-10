import Link from "next/link";
import { siteConfig } from "@/config/site";

type LanguagePillsProps = {
  active?: string;
  basePath?: string;
};

export function LanguagePills({
  active = "all",
  basePath = "/",
}: LanguagePillsProps) {
  const current = (active || "all").toLowerCase();

  return (
    <div className="inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-[20px] bg-[#e7e7eb] p-1 dark:bg-[#2a2a2e]">
      {siteConfig.languages.map((language) => {
        const href =
          language.id === "all"
            ? basePath
            : `${basePath}${basePath.includes("?") ? "&" : "?"}language=${language.id}`;
        const selected = current === language.id;

        return (
          <Link
            key={language.id}
            href={href}
            scroll={false}
            aria-current={selected ? "true" : undefined}
            className={`shrink-0 rounded-[14px] px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              selected
                ? "bg-white text-text shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:bg-[#121214] dark:text-white dark:shadow-none"
                : "text-text-secondary hover:text-text dark:text-white/70 dark:hover:text-white"
            }`}
          >
            {language.label}
          </Link>
        );
      })}
    </div>
  );
}
