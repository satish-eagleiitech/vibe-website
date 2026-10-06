import Link from "next/link";
import { Mic } from "lucide-react";
import { Container } from "@/components/common/Container";

export function HostEventBanner() {
  return (
    <section className="w-full pb-16 md:pb-20">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-surface p-6 shadow-md md:flex-row md:p-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-surface-muted text-accent shadow-sm">
              <Mic className="size-8" />
            </div>
            <div>
              <h3 className="text-[28px] font-extrabold tracking-tight text-text md:text-[32px]">
                List your events on VYBE
              </h3>
              <p className="mt-1 text-[15px] text-text-secondary">
                Host concerts, club nights, workshops, and sports matches with
                India&apos;s smoothest ticketing network.
              </p>
            </div>
          </div>
          <Link
            href="/partner-with-us"
            className="w-full shrink-0 rounded-full bg-accent px-8 py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-[#E70052] md:w-auto"
          >
            Start Hosting
          </Link>
        </div>
      </Container>
    </section>
  );
}
