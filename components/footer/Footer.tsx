import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Logo } from "@/components/common/Logo";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import { siteConfig } from "@/config/site";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11.25 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const social = [
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon },
  { href: "https://x.com", label: "Twitter", icon: XIcon },
  { href: "https://instagram.com", label: "Instagram", icon: InstagramIcon },
  { href: "https://linkedin.com", label: "LinkedIn", icon: LinkedinIcon },
];

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative z-10 mt-10 w-full overflow-hidden border-t border-border bg-surface text-text dark:border-white/10 dark:bg-black dark:text-white md:mt-14">
      {/* Accent glow from the absolute bottom of the footer (reference floor light) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[220px] bg-gradient-to-t from-accent/10 via-accent/5 to-transparent md:h-[280px] dark:from-accent/55 dark:via-accent/22"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[120px] bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgb(255_0_91_/_0.35)_0%,transparent_70%)] opacity-80 blur-2xl md:h-[160px] dark:bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgb(255_0_91_/_0.65)_0%,transparent_70%)]"
      />

      <div className="relative z-10">
        <Container fullWidth className="pt-10 md:pt-8">
          {/* Top — brand + nav */}
          <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-center md:justify-between dark:border-white/15">
            <Logo />
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center gap-x-5 gap-y-2 md:gap-x-6"
            >
              {siteConfig.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-bold tracking-[0.14em] text-text-secondary uppercase transition-colors hover:text-accent dark:text-white/70 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              {/* <span
                aria-hidden="true"
                className="hidden h-4 w-px bg-border sm:inline-block dark:bg-white/25"
              /> */}
              {/* <Link
                href="/partner-with-us"
                className="text-[11px] font-bold tracking-[0.14em] text-text uppercase transition-colors hover:text-accent dark:text-white dark:hover:text-accent"
              >
                Partner
              </Link> */}
            </nav>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 gap-8 py-10 md:grid-cols-4 md:gap-10 md:py-12">
            <div>
              <h3 className="text-[11px] font-bold tracking-[0.16em] text-text-muted uppercase dark:text-white/45">
                The Studio
              </h3>
              <p className="mt-4 text-[14px] leading-6 font-medium text-text-secondary dark:text-white/80">
                {siteConfig.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>

            <div>
              <h3 className="text-[11px] font-bold tracking-[0.16em] text-text-muted uppercase dark:text-white/45">
                Contact Us
              </h3>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="mt-4 block text-[14px] font-medium text-text-secondary transition-colors hover:text-accent dark:text-white/80 dark:hover:text-accent"
              >
                {siteConfig.contact.email}
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="mt-2 block text-[14px] font-medium text-text-secondary transition-colors hover:text-accent dark:text-white/80 dark:hover:text-accent"
              >
                {siteConfig.contact.phone}
              </a>
            </div>

            <div>
              <h3 className="text-[11px] font-bold tracking-[0.16em] text-text-muted uppercase dark:text-white/45">
                Pages
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {[
                  { href: "/", label: "Home" },
                  ...siteConfig.footer.company.slice(0, 4),
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-medium text-text-secondary transition-colors hover:text-accent dark:text-white/80 dark:hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-bold tracking-[0.16em] text-text-muted uppercase dark:text-white/45">
                Social
              </h3>
              <div className="mt-4 flex items-center gap-4">
                {social.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="text-text-secondary transition-colors hover:text-accent dark:text-white/80 dark:hover:text-accent"
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>

        {/* Giant wordmark — ultra-bold condensed (Druk-style) */}
        <div className="relative overflow-hidden px-2 pt-2 pb-2 md:px-6 lg:px-12">
          <p
            aria-hidden="true"
            className="relative select-none text-center font-[family-name:var(--font-druk)] text-[22vw] leading-[0.78] tracking-[0.06em] [font-kerning:none] text-text/[0.36] uppercase dark:text-white md:text-[16vw] lg:text-[15vw]"
          >
            {siteConfig.name}
          </p>
        </div>

        <Container fullWidth>
          <div className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-text-muted uppercase dark:text-white/70">
              © {year} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {siteConfig.footer.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[10px] font-semibold tracking-[0.12em] text-text-muted uppercase transition-colors hover:text-accent dark:text-white/70 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className="pointer-events-none absolute right-4 bottom-6 z-20 md:right-10 md:bottom-14 lg:right-12">
        <div className="pointer-events-auto">
          <ScrollToTopButton />
        </div>
      </div>
    </footer>
  );
}
