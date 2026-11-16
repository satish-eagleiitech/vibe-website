"use client";

import Link from "next/link";
import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent, type ReactNode } from "react";
import { AdultRatingModal } from "@/components/movies/AdultRatingModal";
import { isAdultCertification } from "@/lib/movies/adult";

type BookTicketsButtonProps = {
  href: string;
  certification?: string;
  className?: string;
  children?: ReactNode;
  /** Kept for call-site compatibility; language picker is deferred. */
  title?: string;
  languages?: string[];
};

function ackKey(href: string) {
  return `vybe-adult-ack:${href}`;
}

export function BookTicketsButton({
  href,
  certification,
  className = "",
  children,
}: BookTicketsButtonProps) {
  const router = useRouter();
  const adult = isAdultCertification(certification);
  const [adultOpen, setAdultOpen] = useState(false);

  function go() {
    router.push(href);
  }

  function afterAdultAck() {
    try {
      sessionStorage.setItem(ackKey(href), "1");
    } catch {
      /* ignore */
    }
    setAdultOpen(false);
    go();
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!adult) return;
    event.preventDefault();
    try {
      if (sessionStorage.getItem(ackKey(href)) === "1") {
        go();
        return;
      }
    } catch {
      /* ignore */
    }
    setAdultOpen(true);
  }

  return (
    <>
      <Link href={href} onClick={onClick} className={className}>
        {children ?? (
          <>
            <Ticket className="size-5" strokeWidth={2.5} />
            Book tickets
          </>
        )}
      </Link>
      <AdultRatingModal
        open={adultOpen}
        certification={certification}
        onContinue={afterAdultAck}
        onClose={() => setAdultOpen(false)}
      />
    </>
  );
}
