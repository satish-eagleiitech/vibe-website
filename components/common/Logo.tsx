import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  priority?: boolean;
  overlay?: boolean;
};

export function Logo({
  className = "",
  priority = false,
  overlay = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="VYBE home"
    >
      <Image
        src="/logos/vybe-logo.png?v=4"
        alt="VYBE"
        width={148}
        height={40}
        priority={priority}
        unoptimized
        className={`h-7 w-auto bg-transparent md:h-8 ${
          overlay
            ? "brightness-0 invert drop-shadow-md"
            : "dark:brightness-0 dark:invert dark:drop-shadow-md"
        }`}
      />
    </Link>
  );
}
