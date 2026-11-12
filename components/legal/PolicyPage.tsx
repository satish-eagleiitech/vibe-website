import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { siteConfig } from "@/config/site";

export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  points?: string[];
};

type PolicyPageProps = {
  eyebrow?: string;
  title: string;
  updated: string;
  intro: string;
  sections?: PolicySection[];
  children?: ReactNode;
  current: string;
};

const RELATED = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/refund-policy", label: "Cancellation & refund policy" },
  { href: "/faq", label: "FAQs" },
];

export function PolicyPage({
  eyebrow = "Terms and conditions",
  title,
  updated,
  intro,
  sections = [],
  children,
  current,
}: PolicyPageProps) {
  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="mx-auto max-w-[860px]">
          <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">{eyebrow}</p>
          <h1 className="mt-2 text-[28px] font-extrabold tracking-tight text-text md:text-[36px]">
            {title}
          </h1>
          <p className="mt-1.5 text-[13px] text-text-muted">Last updated: {updated}</p>
          <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">{intro}</p>

          <div className="mt-8 space-y-4">
            {sections.map((section, index) => (
              <article
                key={section.heading}
                className="rounded-[20px] border border-border bg-surface p-5 md:p-6"
              >
                <h2 className="flex items-baseline gap-3 text-[16px] font-extrabold text-text md:text-[17px]">
                  <span className="text-[13px] font-bold text-text-muted tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </h2>
                {section.paragraphs?.map((text) => (
                  <p key={text} className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                    {text}
                  </p>
                ))}
                {section.points?.length ? (
                  <ul className="mt-3 space-y-2.5">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-[14px] leading-relaxed text-text-secondary"
                      >
                        <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-text-muted" />
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
            {children}
          </div>

          <div className="mt-8 rounded-[20px] border border-border bg-surface-muted p-5 md:p-6">
            <p className="text-[15px] font-extrabold text-text">Still need help?</p>
            <p className="mt-1 text-[14px] leading-relaxed text-text-secondary">
              Write to{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-semibold text-text underline underline-offset-2"
              >
                {siteConfig.contact.email}
              </a>{" "}
              or call{" "}
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="font-semibold text-text underline underline-offset-2"
              >
                {siteConfig.contact.phone}
              </a>
              . We reply within 24 hours.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {RELATED.filter((link) => link.href !== current).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-semibold text-text transition-colors hover:border-text-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
