/** Indian / common theatrical adult ratings */
export function isAdultCertification(certification?: string | null): boolean {
  if (!certification) return false;
  const c = certification.trim().toUpperCase();
  if (!c) return false;
  if (c === "A" || c === "18+" || c === "R" || c === "NC-17" || c === "X") return true;
  if (c.startsWith("A ") || c.startsWith("A(") || c.includes("ADULT")) return true;
  if (/\b18\s*\+?\b/.test(c)) return true;
  return false;
}
