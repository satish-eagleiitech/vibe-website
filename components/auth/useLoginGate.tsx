"use client";

import { useRef, useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import { isSignedIn } from "@/lib/auth/session";

export function useLoginGate() {
  const [open, setOpen] = useState(false);
  const after = useRef<(() => void) | null>(null);

  function gate(action: () => void, resume = false) {
    if (isSignedIn()) {
      action();
      return;
    }
    after.current = resume ? action : null;
    setOpen(true);
  }

  function close() {
    after.current = null;
    setOpen(false);
  }

  function finish() {
    const next = after.current;
    after.current = null;
    setOpen(false);
    next?.();
  }

  const modal = <LoginModal open={open} onClose={close} onDone={finish} />;

  return { gate, modal };
}
