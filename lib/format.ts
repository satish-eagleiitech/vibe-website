export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRuntime(minutes?: number | null): string | undefined {
  if (!minutes) return undefined;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}h ${rest}m` : `${rest}m`;
}

export function formatVoteCount(count: number): string {
  if (count >= 1000) {
    const compact = count >= 10_000 ? Math.round(count / 1000) : (count / 1000).toFixed(1);
    return `${compact}K votes`;
  }
  return `${count} votes`;
}

export function movieMeta(genres: string[], languages: string[], duration?: string): string {
  const languageLabel = languages
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(", ");

  return [genres.slice(0, 2).join(", "), languageLabel, duration]
    .filter(Boolean)
    .join(" • ");
}
