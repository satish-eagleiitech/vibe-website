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
    <div className="flex flex-wrap items-center gap-2">
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
            className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition-colors ${
              selected
                ? "bg-accent text-white"
                : "bg-surface-muted text-text hover:bg-border"
            }`}
          >
            {language.label}
          </Link>
        );
      })}
    </div>
  );
}
