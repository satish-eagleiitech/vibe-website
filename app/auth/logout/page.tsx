"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markSignedOut } from "@/lib/auth/session";
import { resetProfile } from "@/lib/profile/storage";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    markSignedOut();
    resetProfile();
    router.replace("/");
  }, [router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm font-semibold text-text-secondary">
      Signing out…
    </div>
  );
}
