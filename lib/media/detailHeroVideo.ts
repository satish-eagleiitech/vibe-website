/** Clips under `public/assets/videos` — rotated across detail heroes */
export const DETAIL_HERO_VIDEOS = [
  "/assets/videos/vybe-1.mp4",
  "/assets/videos/vybe-2.mp4",
  "/assets/videos/vybe-3.mp4",
  "/assets/videos/vybe-4.mp4",
  "/assets/videos/vybe-5.mp4",
  "/assets/videos/vybe-6.mp4",
  "/assets/videos/vybe-7.mp4",
  "/assets/videos/vybe-8.mp4",
  "/assets/videos/vybe-9.mp4",
  "/assets/videos/vybe-10.mp4",
  "/assets/videos/vybe-11.mp4",
  "/assets/videos/gokart.mp4",
  "/assets/videos/music-ni8.mp4",
] as const;

const ID_VIDEO_OVERRIDES: Record<string, string> = {
  "activity-wonderla": "/assets/videos/vybe-11.mp4",
  "activity-gokart": "/assets/videos/gokart.mp4",
  "activity-water-slides": "/assets/videos/vybe-5.mp4",
  "activity-water-pirate": "/assets/videos/vybe-5.mp4",
  "activity-bowling": "/assets/videos/vybe-6.mp4",
  "activity-trampoline": "/assets/videos/vybe-4.mp4",
  "activity-theme-night": "/assets/videos/vybe-7.mp4",
  "activity-ramoji": "/assets/videos/vybe-10.mp4",
  "event-dj-night": "/assets/videos/music-ni8.mp4",
  "event-neon-arena": "/assets/videos/vybe-8.mp4",
  "event-comedy-circuit": "/assets/videos/vybe-9.mp4",
};

const KEYWORD_RULES: { pattern: RegExp; video: string }[] = [
  { pattern: /gokart|kart/i, video: "/assets/videos/gokart.mp4" },
  { pattern: /wonderla|theme|carnival/i, video: "/assets/videos/vybe-11.mp4" },
  { pattern: /water|aqua|splash|kayak|scuba/i, video: "/assets/videos/vybe-5.mp4" },
  { pattern: /bowl|arcade|game|vr|laser/i, video: "/assets/videos/vybe-6.mp4" },
  { pattern: /tramp|jump|mall/i, video: "/assets/videos/vybe-4.mp4" },
  { pattern: /music|dj|concert|club|garba/i, video: "/assets/videos/music-ni8.mp4" },
  { pattern: /football|cricket|sport|turf|play-/i, video: "/assets/videos/vybe-8.mp4" },
  { pattern: /comedy|stand/i, video: "/assets/videos/vybe-9.mp4" },
  { pattern: /trek|hike|camp|zipline|rock|climb/i, video: "/assets/videos/vybe-3.mp4" },
  { pattern: /yoga|wellness|candle/i, video: "/assets/videos/vybe-2.mp4" },
];

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function resolveDetailHeroVideo(detailId: string, explicitUrl?: string): string {
  if (explicitUrl) return explicitUrl;
  const trimmed = detailId.trim();
  if (!trimmed) return DETAIL_HERO_VIDEOS[0];

  const override = ID_VIDEO_OVERRIDES[trimmed];
  if (override) return override;

  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(trimmed)) return rule.video;
  }

  return DETAIL_HERO_VIDEOS[hashId(trimmed) % DETAIL_HERO_VIDEOS.length];
}
