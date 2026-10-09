import Image from "next/image";
import Link from "next/link";

type ProfileLinkProps = {
  overlay?: boolean;
};

export function ProfileLink({ overlay = false }: ProfileLinkProps) {
  return (
    <Link
      href="/profile"
      aria-label="Profile"
      className={`inline-flex size-[34px] items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-90 ${
        overlay ? "ring-1 ring-white/25" : "ring-1 ring-black/10 dark:ring-white/15"
      }`}
    >
      <Image
        src="/images/profile-avatar.png"
        alt=""
        width={34}
        height={34}
        className="size-full object-cover"
      />
    </Link>
  );
}
