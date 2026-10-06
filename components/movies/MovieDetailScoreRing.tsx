type MovieDetailScoreRingProps = {
  value: number;
  label?: string;
};

export function MovieDetailScoreRing({
  value,
  label = "out of 10",
}: MovieDetailScoreRingProps) {
  const clamped = Math.min(10, Math.max(0, value));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 10) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative size-[140px]">
        <svg className="size-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-border"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-accent transition-[stroke-dashoffset] duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[28px] font-extrabold leading-none text-text">
            {clamped.toFixed(1)}
          </span>
          <span className="mt-1 text-[10px] font-semibold text-text-muted uppercase">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
