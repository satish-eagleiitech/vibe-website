"use client";

import Link from "next/link";
import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent, type ReactNode } from "react";
import { AdultRatingModal } from "@/components/movies/AdultRatingModal";
import { LanguageSelectModal } from "@/components/movies/LanguageSelectModal";
import { isPanIndiaMovie } from "@/lib/data/bookingTerms";
import { isAdultCertification } from "@/lib/movies/adult";

type BookTicketsButtonProps = {
  href: string;
  certification?: string;
  className?: string;
  children?: ReactNode;
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
  title = "Movie",
  languages = [],
}: BookTicketsButtonProps) {
  const router = useRouter();
  const adult = isAdultCertification(certification);
  const needsLanguage = isPanIndiaMovie(languages);
  const [adultOpen, setAdultOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  function bookUrl(language?: string) {
    if (!language) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}lang=${encodeURIComponent(language)}`;
  }

  function go(language?: string) {
    router.push(bookUrl(language));
  }

  function afterAdultAck() {
    try {
      sessionStorage.setItem(ackKey(href), "1");
    } catch {
      /* ignore */
    }
    setAdultOpen(false);
    if (needsLanguage) {
      setLangOpen(true);
      return;
    }
    go();
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!adult && !needsLanguage) return;
    event.preventDefault();

    if (adult) {
      try {
        if (sessionStorage.getItem(ackKey(href)) === "1") {
          if (needsLanguage) {
            setLangOpen(true);
            return;
          }
          go();
          return;
        }
      } catch {
        /* ignore */
      }
      setAdultOpen(true);
      return;
    }

    setLangOpen(true);
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
      <LanguageSelectModal
        open={langOpen}
        title={title}
        languages={languages}
        originalLanguage={languages[0]}
        onClose={() => setLangOpen(false)}
        onProceed={(language) => {
          setLangOpen(false);
          go(language);
        }}
      />
    </>
  );
}
