"use client";

import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useLoginGate } from "@/components/auth/useLoginGate";

export function ProfileGateLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const { gate, modal } = useLoginGate();

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => gate(() => router.push("/profile"), true)}
      >
        {children}
      </button>
      {modal}
    </>
  );
}

type ProfileLinkProps = {
  /** Match search / theme dock control style */
  dock?: boolean;
};

export function ProfileLink({ dock = false }: ProfileLinkProps) {
  const router = useRouter();
  const { gate, modal } = useLoginGate();

  return (
    <>
      <button
        type="button"
        aria-label="Profile"
        onClick={() => gate(() => router.push("/profile"), true)}
        className={
          dock
            ? "focus-ring-none inline-flex size-9 shrink-0 items-center justify-center rounded-full text-text transition-colors hover:bg-black/[0.06] dark:text-white dark:hover:bg-white/10"
            : "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-text transition-colors hover:bg-black/[0.06] dark:hover:bg-white/10"
        }
      >
        <User className="size-[18px]" strokeWidth={1.8} />
      </button>
      {modal}
    </>
  );
}
