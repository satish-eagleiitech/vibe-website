import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  priority?: boolean;
  /** Transparent nav over dark hero */
  overlay?: boolean;
};

const imgClass =
  "h-9 w-auto bg-transparent object-contain object-left md:h-10";

export function Logo({
  className = "",
  priority = false,
  overlay = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center bg-transparent ${className}`}
      aria-label="VYBE home"
    >
      {overlay ? (
        <Image
          src="/logos/vybe-logo-dark.png?v=24"
          alt="VYBE"
          width={180}
          height={72}
          priority={priority}
          unoptimized
          className={imgClass}
        />
      ) : (
        <>
          <Image
            src="/logos/vybe-logo-light.png?v=26"
            alt="VYBE"
            width={180}
            height={72}
            priority={priority}
            unoptimized
            className={`${imgClass} dark:hidden`}
          />
          <Image
            src="/logos/vybe-logo-dark.png?v=24"
            alt="VYBE"
            width={180}
            height={72}
            priority={priority}
            unoptimized
            className={`${imgClass} hidden dark:block`}
          />
        </>
      )}
    </Link>
  );
}
