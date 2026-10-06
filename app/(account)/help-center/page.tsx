import Link from "next/link";
import {
  ChevronDown,
  FileText,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";

export const metadata = { title: "Help & safety" };

const contact = [
  {
    icon: Mail,
    title: "Email support",
    body: "hello@vybe.app",
    href: "mailto:hello@vybe.app",
  },
  {
    icon: Phone,
    title: "Call us",
    body: "+91 40 4567 8900",
    href: "tel:+914045678900",
  },
  {
    icon: RotateCcw,
    title: "Refund policy",
    body: "Cancellations and refunds",
    href: "/refund-policy",
  },
  {
    icon: Lock,
    title: "Privacy",
    body: "How we use your data",
    href: "/privacy-policy",
  },
];

const faqs = [
  {
    q: "Where are my tickets?",
    a: "Open Profile → Bookings. Filter by Movies, Dining, Events or Game Zone, then tap View ticket for the QR and seat details.",
  },
  {
    q: "How do I change my city?",
    a: "Tap the city name in the header, or edit your city from Profile → Edit profile.",
  },
  {
    q: "Can I edit my name or photo?",
    a: "Yes. Go to Profile and tap Edit profile to change name, phone, email, gender, city and photo.",
  },
  {
    q: "How do refunds work?",
    a: "Movie tickets can be cancelled from the ticket page before showtime. Dining and events follow the venue policy shown at checkout.",
  },
  {
    q: "How do scratch cards work?",
    a: "Every booking unlocks a scratch card in Rewards. Scratch it to reveal a discount code for movies, dining, events or Game Zone.",
  },
];

const safetyTips = [
  "VYBE will never ask for your OTP, UPI PIN or card CVV over call or chat.",
  "Only share your ticket QR at the venue entry gate.",
  "Meeting new people at an event? Share your plan with a friend.",
  "Report suspicious listings to hello@vybe.app and we'll act within 24 hours.",
];

export default function HelpPage() {
  return (
    <div>
      <AccountPageHeader title="Help & safety" subtitle="Support, refunds, privacy and staying safe" />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {contact.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[20px] border border-border bg-surface p-4 transition-colors hover:border-accent/40"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <p className="mt-3 text-[14px] font-extrabold text-text">{item.title}</p>
              <p className="mt-0.5 truncate text-[12px] text-text-secondary">{item.body}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[24px] border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-text">
            <FileText className="size-4 text-accent" />
            Frequently asked
          </h2>
          <div className="mt-3 divide-y divide-border">
            {faqs.map((item) => (
              <details key={item.q} className="group py-3.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-bold text-text [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="size-4 shrink-0 text-text-muted transition-transform group-open:rotate-180 group-open:text-accent" />
                </summary>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="self-start rounded-[24px] bg-sidebar p-5 text-white">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent">
            <ShieldCheck className="size-5" />
          </span>
          <h2 className="mt-3 text-[16px] font-extrabold">Stay safe on VYBE</h2>
          <ul className="mt-3 space-y-3">
            {safetyTips.map((tip) => (
              <li key={tip} className="flex gap-2.5 text-[13px] leading-snug text-white/75">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {tip}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-5 flex h-10 items-center justify-center rounded-full bg-white text-[12px] font-extrabold tracking-wide text-[#14141b] uppercase transition-opacity hover:opacity-90"
          >
            Report an issue
          </Link>
        </section>
      </div>
    </div>
  );
}
