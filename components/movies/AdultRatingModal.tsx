"use client";

type AdultRatingModalProps = {
  open: boolean;
  certification?: string;
  onContinue: () => void;
  onClose: () => void;
};

export function AdultRatingModal({
  open,
  certification = "A",
  onContinue,
  onClose,
}: AdultRatingModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px] dark:bg-black/70"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="adult-rating-title"
        className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] dark:border dark:border-border"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="adult-rating-title"
          className="text-[18px] font-extrabold tracking-tight text-text"
        >
          This movie is rated &apos;{certification || "A"}&apos;
        </h2>

        <div className="mt-5 flex gap-3.5">
          <span
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-extrabold text-white"
            aria-hidden
          >
            18+
          </span>
          <p className="text-[14px] leading-6 text-text-secondary">
            This movie is only for viewers above 18. Please carry a valid ID /
            Age Proof to the theatre. If you are denied entry due to age or ID
            issues, you will not get a refund.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 w-full rounded-full bg-accent py-3.5 text-[15px] font-extrabold text-white transition-transform hover:scale-[1.01]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
