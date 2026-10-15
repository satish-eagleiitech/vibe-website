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
  const [open, setOpen] = useState(false);

  function go() {
    router.push(href);
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!adult) return;
    try {
      if (sessionStorage.getItem(ackKey(href)) === "1") return;
    } catch {
      /* ignore */
    }
    event.preventDefault();
    setOpen(true);
  }

  function onContinue() {
    try {
      sessionStorage.setItem(ackKey(href), "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
    go();
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
        open={open}
        certification={certification}
        onContinue={onContinue}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
