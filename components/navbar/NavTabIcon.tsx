import { siteConfig } from "@/config/site";

export const TAB_ICONS: Record<(typeof siteConfig.nav)[number]["href"], string> = {
  "/movies": "/icons/nav-movies.png",
  "/events": "/icons/nav-events.png",
  "/activities": "/icons/nav-activities.png",
  "/play": "/icons/nav-play.png",
};

export function TabIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="inline-block size-[18px] shrink-0 bg-current"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
