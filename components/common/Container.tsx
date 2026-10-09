import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** Full-bleed layout for navbar / footer / hero edges */
  fullWidth?: boolean;
};

export function Container({
  children,
  className = "",
  fullWidth = false,
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 md:px-8 lg:px-12 4xl:px-16 ${
        fullWidth ? "max-w-none" : "max-w-[1360px] 3xl:max-w-[1520px] 4xl:max-w-[1920px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
