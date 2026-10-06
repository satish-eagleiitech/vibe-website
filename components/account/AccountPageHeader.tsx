import type { ReactNode } from "react";

type AccountPageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function AccountPageHeader({ title, subtitle, action }: AccountPageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[24px] font-extrabold tracking-tight text-text md:text-[28px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 text-[13px] text-text-secondary md:text-[14px]">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
