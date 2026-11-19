"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { PolicyNavItem } from "@/components/legal/PolicyPage";

type PolicySidebarProps = {
  nav: PolicyNavItem[];
};

function childMatches(href: string, pathname: string, hash: string) {
  const [path, anchor] = href.split("#");
  if (path !== pathname) return false;
  if (anchor) return hash === `#${anchor}`;
  return true;
}

export function PolicySidebar({ nav }: PolicySidebarProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-text-muted uppercase">
        Policies
      </p>
      <nav
        aria-label="Policy navigation"
        className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0"
      >
        {nav.map((item) => {
          const path = item.href.split("#")[0];
          const childActive = item.children?.some((child) =>
            childMatches(child.href, pathname, hash),
          );
          const parentExact = path === pathname && !hash;
          const active = parentExact || Boolean(childActive);
          const expanded =
            path === pathname ||
            Boolean(
              item.children?.some((child) => child.href.split("#")[0] === pathname),
            );

          return (
            <div key={item.href} className="shrink-0 lg:shrink">
              <Link
                href={item.href}
                onClick={() => setHash("")}
                className={`block rounded-lg px-3 py-2 text-[13px] transition-colors lg:rounded-md ${
                  active
                    ? "bg-surface-muted font-semibold text-text"
                    : "font-medium text-text-secondary hover:bg-surface-muted/70 hover:text-text"
                }`}
              >
                {item.label}
              </Link>
              {item.children?.length && expanded ? (
                <div className="ml-3 mt-0.5 hidden border-l border-border pl-2 lg:block">
                  {item.children.map((child) => {
                    const isChildCurrent = childMatches(child.href, pathname, hash);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => {
                          const anchor = child.href.split("#")[1];
                          setHash(anchor ? `#${anchor}` : "");
                        }}
                        className={`block rounded-md px-2 py-1.5 text-[12px] transition-colors hover:text-text ${
                          isChildCurrent
                            ? "font-semibold text-text"
                            : "font-medium text-text-muted"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
