"use client";

import { PhoneLoginDialog } from "@/components/auth/PhoneLoginDialog";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
};

export function LoginModal({ open, onClose, onDone }: LoginModalProps) {
  return <PhoneLoginDialog open={open} onClose={onClose} onDone={onDone} />;
}
