import Link from "next/link";
import { User } from "lucide-react";

type ProfileLinkProps = {
  overlay?: boolean;
};

export function ProfileLink({ overlay = false }: ProfileLinkProps) {
  return (
    <Link
      href="/profile"
      aria-label="Profile"
      className={`inline-flex size-9 items-center justify-center rounded-full transition-colors ${
        overlay
          ? "text-white hover:bg-white/15"
          : "text-text hover:bg-black/[0.06] dark:hover:bg-white/10"
      }`}
    >
      <User className="size-[18px]" strokeWidth={2.25} />
    </Link>
  );
}
