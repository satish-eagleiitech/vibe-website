"use client";

import Image from "next/image";
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
  overlay?: boolean;
};

export function ProfileLink({ overlay = false }: ProfileLinkProps) {
  const router = useRouter();
  const { gate, modal } = useLoginGate();

  return (
    <>
      <button
        type="button"
        aria-label="Profile"
        onClick={() => gate(() => router.push("/profile"), true)}
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
      </button>
      {modal}
    </>
  );
}
