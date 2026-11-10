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
  /** Larger avatar that caps the top dock */
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
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent p-0 transition-opacity hover:opacity-90 ${
          dock
            ? "relative z-10 size-11 shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
            : "size-[34px] shadow-[0_4px_10px_rgba(0,0,0,0.22)]"
        }`}
      >
        <Image
          src="/images/profile-avatar-3d.png"
          alt=""
          width={256}
          height={256}
          className="size-full object-cover"
        />
      </button>
      {modal}
    </>
  );
}
