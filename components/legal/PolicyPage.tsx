import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { PolicySidebar } from "@/components/legal/PolicySidebar";
import { PolicyToc } from "@/components/legal/PolicyToc";
import { siteConfig } from "@/config/site";

export type PolicySection = {
  id?: string;
  heading?: string;
  paragraphs?: string[];
  points?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  subsections?: PolicySection[];
};

export type PolicyNavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

type PolicyPageProps = {
  title: string;
  updated: string;
  subtitle?: string;
  intro?: string;
  sections?: PolicySection[];
  children?: ReactNode;
  current: string;
  nav?: PolicyNavItem[];
  showToc?: boolean;
  /** District-style 1. 2. 3. section headings */
  numbered?: boolean;
  breadcrumbs?: { href?: string; label: string }[];
};

const DEFAULT_NAV: PolicyNavItem[] = [
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Cancellation & Refund" },
  { href: "/faq", label: "FAQ" },
];


function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-text">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function SectionBlock({
  section,
  depth = 0,
  number,
}: {
  section: PolicySection;
  depth?: number;
  number?: number;
}) {
  const HeadingTag = depth === 0 ? "h2" : depth === 1 ? "h3" : "h4";
  const headingClass =
    depth === 0
      ? "text-[20px] font-extrabold tracking-tight text-text md:text-[24px]"
      : depth === 1
        ? "text-[16px] font-bold text-text md:text-[17px]"
        : "text-[15px] font-bold text-text";

  const label =
    number && section.heading ? `${number}. ${section.heading}` : section.heading;

  return (
    <section id={section.id} className={depth === 0 ? "scroll-mt-24" : "mt-5 scroll-mt-24"}>
      {label ? <HeadingTag className={headingClass}>{label}</HeadingTag> : null}
      {section.paragraphs?.map((text) => (
        <p
          key={text.slice(0, 64)}
          className="mt-3 text-[14px] leading-[1.75] text-text-secondary md:text-[15px]"
        >
          <RichText text={text} />
        </p>
      ))}
      {section.points?.length ? (
        <ul className="mt-3 list-disc space-y-2.5 pl-5 text-[14px] leading-[1.75] text-text-secondary md:text-[15px]">
          {section.points.map((point) => (
            <li key={point.slice(0, 64)}>
              <RichText text={point} />
            </li>
          ))}
        </ul>
      ) : null}
      {section.table ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[320px] border-collapse text-left text-[13px] md:text-[14px]">
            <thead className="bg-surface-muted">
              <tr>
                {section.table.headers.map((header) => (
                  <th
                    key={header}
                    className="border-b border-border px-3 py-2.5 font-bold text-text"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row.join("|")} className="border-b border-border last:border-b-0">
                  {row.map((cell) => (
                    <td key={cell} className="px-3 py-2.5 text-text-secondary">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {section.subsections?.map((sub, index) => (
        <SectionBlock
          key={sub.id ?? sub.heading ?? `${section.id ?? "section"}-${index}`}
          section={sub}
          depth={sub.heading ? depth + 1 : depth}
        />
      ))}
    </section>
  );
}

export function PolicyPage({
  title,
  updated,
  subtitle,
  intro,
  sections = [],
  children,
  current,
  nav = DEFAULT_NAV,
  showToc = false,
  numbered = false,
  breadcrumbs,
}: PolicyPageProps) {
  const tocItems = sections.filter(
    (section): section is PolicySection & { id: string; heading: string } =>
      Boolean(section.id && section.heading),
  );

  const crumbs = breadcrumbs ?? [{ href: "/", label: "Home" }, { label: title }];

  return (
    <section className="bg-white py-8 md:py-12 dark:bg-bg">
      <Container>
        <div
          className={`grid gap-8 lg:gap-10 ${
            showToc
              ? "lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_200px]"
              : "lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]"
          }`}
        >
          <PolicySidebar nav={nav} />

          <div className="min-w-0 max-w-[760px]">
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-x-1.5 text-[12px] text-text-muted">
              {crumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-x-1.5">
                  {index > 0 ? <span>›</span> : null}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-text">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-text">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>

            <h1 className="text-[28px] font-extrabold tracking-tight text-text md:text-[36px]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1.5 text-[14px] text-text-secondary md:text-[15px]">{subtitle}</p>
            ) : null}
            <p className="mt-2 text-[13px] text-text-muted italic">Last updated: {updated}.</p>
            {intro ? (
              <p className="mt-5 text-[15px] leading-[1.75] text-text-secondary">{intro}</p>
            ) : null}

            <div className="mt-8 space-y-10 border-t border-border pt-8">
              {sections.map((section, index) => (
                <SectionBlock
                  key={section.id ?? section.heading ?? `section-${index}`}
                  section={section}
                  number={numbered && section.heading ? index + 1 : undefined}
                />
              ))}
              {children}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-surface-muted/60 p-5 md:p-6">
              <p className="text-[15px] font-extrabold text-text">Need help?</p>
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
                .
              </p>
            </div>
          </div>

          {showToc && tocItems.length > 0 ? <PolicyToc items={tocItems} /> : null}
        </div>
      </Container>
    </section>
  );
}
