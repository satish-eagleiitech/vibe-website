"use client";

import { QRCodeSVG } from "qrcode.react";

/** Scannable ticket QR. Always dark-on-white so scanners read it in dark mode too. */
export function TicketQr({ value, className = "" }: { value: string; className?: string }) {
  return (
    <QRCodeSVG
      value={value}
      level="M"
      marginSize={1}
      bgColor="#ffffff"
      fgColor="#111827"
      className={className}
      role="img"
      aria-label="Ticket QR code"
    />
  );
}
