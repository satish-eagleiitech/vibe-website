"use client";

import { useEffect, useState } from "react";
import { AdultRatingModal } from "@/components/movies/AdultRatingModal";
import { isAdultCertification } from "@/lib/movies/adult";

type AdultBookingGateProps = {
  movieId: string;
  certification?: string;
};

function ackKey(movieId: string) {
  return `vybe-adult-ack:/movies/${movieId}/book`;
}

/** Shows the 18+ warning once when landing on the booking flow for adult-rated titles */
export function AdultBookingGate({
  movieId,
  certification,
}: AdultBookingGateProps) {
  const adult = isAdultCertification(certification);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!adult) return;
    try {
      if (sessionStorage.getItem(ackKey(movieId)) === "1") return;
    } catch {
      /* ignore */
    }
    setOpen(true);
  }, [adult, movieId]);

  function onContinue() {
    try {
      sessionStorage.setItem(ackKey(movieId), "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  return (
    <AdultRatingModal
      open={open}
      certification={certification}
      onContinue={onContinue}
      onClose={onContinue}
    />
  );
}
