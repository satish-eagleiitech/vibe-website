import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import { siteConfig } from "@/config/site";

const CITIES = ["Hyderabad", "Bengaluru", "Mumbai", "Delhi", "Chennai", "Pune"];

const TERMS_LINKS = [
  { href: "/terms-of-service", label: "Booking policy" },
  { href: "/refund-policy", label: "Cancellations" },
  { href: "/refund-policy", label: "Refunds" },
  { href: "/privacy-policy", label: "Privacy policy" },
];

const INFO_LINKS = [
  { href: "/about-us", label: `About ${siteConfig.name}` },
  { href: "/help-center", label: "FAQs" },
  ...siteConfig.nav,
];

const year = new Date().getFullYear();

const linkClass =
  "block text-[14.5px] leading-[1.75] text-white/85 transition-colors hover:text-white";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[22px]">
      <path
        fill="currentColor"
        d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9V11h2v10h3.5V11H17l.4-2.5h-2.9z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[22px]">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.6" cy="7.4" r="1" fill="currentColor" />
    </svg>
  );
}

function Badge({ icon, title, sub }: { icon: ReactNode; title: string; sub: string }) {
  return (
    <span className="grid grid-cols-[36px_auto] grid-rows-2 items-center gap-x-2 text-[11.5px] leading-[1.05] font-bold tracking-[0.04em] text-white uppercase">
      <svg viewBox="0 0 36 36" className="row-span-2 size-9">
        {icon}
      </svg>
      {title}
      <small className="text-[11px] font-medium tracking-[0.08em] opacity-85">{sub}</small>
    </span>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 mt-10 w-full text-white md:mt-14">
      <Image
        src="/images/footer/skyline.png"
        alt=""
        width={3840}
        height={936}
        sizes="100vw"
        className="block h-auto w-full select-none"
        aria-hidden
      />

      <div className="-mt-px bg-[#2b064b]">
        <div className="mx-auto grid max-w-[1080px] gap-10 px-[6vw] pt-10 pb-9 sm:grid-cols-2 md:grid-cols-[1.15fr_1fr_1.15fr] md:gap-[4vw] lg:px-12">
          <div>
            <h2 className="mb-4 text-[15.5px] font-bold">Terms and conditions</h2>
            {TERMS_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[15px] font-semibold">Follow {siteConfig.name}</span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label={`${siteConfig.name} on Facebook`}
                className="grid size-7 place-items-center transition-opacity hover:opacity-80"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label={`${siteConfig.name} on Instagram`}
                className="grid size-7 place-items-center transition-opacity hover:opacity-80"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-[15.5px] font-bold">Information</h2>
            {INFO_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <h2 className="mb-4 text-[15.5px] font-bold">Contact</h2>
            <p className="text-[14.5px] leading-[1.75] font-bold text-white/85">{siteConfig.name}</p>
            {siteConfig.contact.addressLines.map((line) => (
              <p key={line} className="text-[14.5px] leading-[1.75] text-white/85">
                {line}
              </p>
            ))}
            <a href={`mailto:${siteConfig.contact.email}`} className={linkClass}>
              {siteConfig.contact.email}
            </a>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className={linkClass}
            >
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-[5vw] pt-5 pb-10 md:grid-cols-[1fr_auto_1fr] lg:px-12">
          <div className="flex items-center gap-6" aria-hidden>
            <Badge
              title="Secure"
              sub="booking"
              icon={
                <>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M18 8.5l6.2 2.2v6.4c0 4.2-2.6 7.2-6.2 8.4-3.6-1.2-6.2-4.2-6.2-8.4v-6.4L18 8.5z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M15.2 18.2l1.8 1.8 3.8-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              }
            />
            <Badge
              title="Verified"
              sub="checkout"
              icon={
                <>
                  <rect x="4" y="8" width="28" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M11 18.5l4 4 10-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </>
              }
            />
          </div>

          <div className="md:text-center">
            <p className="text-[12.5px] leading-[1.55] text-white/80">
              Movies, events, activities and play around you.
            </p>
            <ul className="my-2 flex flex-wrap gap-x-3 gap-y-1 md:justify-center">
              {CITIES.map((city) => (
                <li key={city} className="text-[11px] font-semibold tracking-[0.04em] text-white/90">
                  {city}
                </li>
              ))}
            </ul>
            <p className="text-[12.5px] leading-[1.55] text-white/80">
              © {year} {siteConfig.name}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4 md:justify-end" aria-label="Payments">
            <span className="text-[20px] font-bold tracking-[-0.03em] italic">Razorpay</span>
            <span className="relative h-7 w-[46px]" aria-hidden>
              <i className="absolute top-0 left-0 size-7 rounded-full bg-[#eb001b]" />
              <i className="absolute top-0 right-0 size-7 rounded-full bg-[#f79e1b] mix-blend-screen" />
            </span>
            <span className="text-[21px] font-extrabold tracking-[0.08em]">UPI</span>
            <div className="ml-auto md:ml-4">
              <ScrollToTopButton />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
