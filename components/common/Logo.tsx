import Link from "next/link";

type LogoProps = {
  className?: string;
  priority?: boolean;
  /** Transparent nav over dark hero */
  overlay?: boolean;
};

export function Logo({ className = "", overlay = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex h-9 shrink-0 items-center bg-transparent -translate-y-0.5 ${className}`}
      aria-label="vybz home"
    >
      <span
        className={`text-[22px] leading-none font-extrabold tracking-tight lowercase sm:text-[24px] ${
          overlay ? "text-white" : "text-accent"
        }`}
        style={{ fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif' }}
      >
        vybz
      </span>
    </Link>
  );
}
