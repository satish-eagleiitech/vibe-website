type EventCardMetaProps = {
  title: string;
  day?: string;
  month?: string;
  venue?: string;
  city?: string;
};

/** Date badge + title + venue/city lines under event card images. */
export function EventCardMeta({ title, day, month, venue, city }: EventCardMetaProps) {
  const line1 = venue?.trim() || city?.trim() || "";
  const line2 = venue?.trim() && city?.trim() && venue.trim() !== city.trim() ? city.trim() : "";

  return (
    <div className="flex items-start gap-2.5 pt-2.5">
      {day || month ? (
        <div className="grid size-[42px] shrink-0 place-items-center rounded-lg bg-[#F0F0F0] text-center dark:bg-surface-muted">
          <div className="leading-none">
            {day ? (
              <p className="text-[15px] font-extrabold tabular-nums text-text">{day}</p>
            ) : null}
            {month ? (
              <p className="mt-0.5 text-[10px] font-bold tracking-wide text-text-secondary uppercase">
                {month}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[14px] font-extrabold leading-snug text-text sm:text-[15px]">
          {title}
        </h3>
        {line1 ? (
          <p className="mt-0.5 line-clamp-1 text-[12px] text-text-secondary">{line1}</p>
        ) : null}
        {line2 ? (
          <p className="line-clamp-1 text-[12px] text-text-secondary">{line2}</p>
        ) : null}
      </div>
    </div>
  );
}
