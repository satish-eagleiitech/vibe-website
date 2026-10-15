import type { ReactNode } from "react";
import { Container } from "@/components/common/Container";

type StickyFilterBarProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

/** Sticks below the site header while scrolling category browse pages (matches Movies). */
export function StickyFilterBar({
  children,
  className,
  containerClassName,
}: StickyFilterBarProps) {
  return (
    <div
      className={`sticky top-(--vybe-header-h) z-30 bg-bg/95 backdrop-blur-xl ${className ?? ""}`}
    >
      <Container
        className={`hide-scrollbar flex items-center gap-1.5 overflow-x-auto py-1.5 ${containerClassName ?? ""}`}
      >
        {children}
      </Container>
    </div>
  );
}
