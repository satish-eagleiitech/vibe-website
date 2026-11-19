"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Container } from "@/components/common/Container";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Booking help");
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="mx-auto grid max-w-[960px] gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
              Contact
            </p>
            <h1 className="mt-2 text-[32px] font-extrabold tracking-tight text-text md:text-[40px]">
              We are here to help
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
              Booking issues, partner questions or product feedback — send a note
              and we reply within 24 hours on business days.
            </p>

            <dl className="mt-8 space-y-4">
              <div className="rounded-[20px] border border-border bg-surface p-4">
                <dt className="text-[11px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-[15px] font-bold text-text underline-offset-2 hover:underline"
                  >
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>
              <div className="rounded-[20px] border border-border bg-surface p-4">
                <dt className="text-[11px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    className="text-[15px] font-bold text-text underline-offset-2 hover:underline"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </dd>
              </div>
              <div className="rounded-[20px] border border-border bg-surface p-4">
                <dt className="text-[11px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
                  Office
                </dt>
                <dd className="mt-1 text-[15px] font-bold text-text">
                  {siteConfig.contact.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-[13px] text-text-secondary">
              Prefer self-serve? Check the{" "}
              <Link href="/faq" className="font-semibold text-accent underline">
                FAQs
              </Link>
              .
            </p>
          </div>

          <div className="rounded-[24px] border border-border bg-surface p-5 md:p-7">
            {sent ? (
              <div className="flex min-h-[320px] flex-col items-start justify-center">
                <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
                  Message received
                </p>
                <h2 className="mt-2 text-[24px] font-extrabold text-text">
                  Thanks — we will get back soon
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                  This demo stores nothing on a server. In production your note
                  would reach support at {siteConfig.contact.email}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setMessage("");
                  }}
                  className="mt-6 rounded-full bg-accent px-5 py-2.5 text-[13px] font-extrabold text-white"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <h2 className="text-[18px] font-extrabold text-text">Send a message</h2>
                <label className="block">
                  <span className="text-[12px] font-bold text-text-secondary">Name</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-bg px-4 text-[14px] font-semibold text-text outline-none focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-bold text-text-secondary">Email</span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-bg px-4 text-[14px] font-semibold text-text outline-none focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-bold text-text-secondary">Topic</span>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-bg px-4 text-[14px] font-semibold text-text outline-none focus:border-accent"
                  >
                    <option>Booking help</option>
                    <option>Refunds</option>
                    <option>Partner enquiry</option>
                    <option>Press / media</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-[12px] font-bold text-text-secondary">Message</span>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1.5 w-full resize-y rounded-2xl border border-border bg-bg px-4 py-3 text-[14px] font-semibold text-text outline-none focus:border-accent"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-accent py-3 text-[14px] font-extrabold text-white transition-transform hover:scale-[1.01]"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
