export const BOOKING_TERMS = [
  "Admission is at the sole discretion of cinema management. VYBZ or the cinema may deny entry without a refund if house rules are broken.",
  "A ticket is compulsory for children aged 3 years and above.",
  "For A-rated movies, guests under 18 years will not be allowed entry even if they hold a ticket.",
  "Outside food and beverages are not permitted. Pre-booked food and beverages must be collected from the F&B counter inside the cinema.",
  "Handbags, laptops, cameras, tablets, digital recorders, lighters and other gadgets are not allowed inside the auditorium.",
  "Guests under the influence of alcohol or drugs will not be allowed inside the cinema premises.",
  "Please arrive at least 15–20 minutes before the show. Late entry may not be allowed once the feature has started.",
  "Tickets once booked cannot be exchanged or cancelled, except where the cinema's cancellation policy allows it or the show is cancelled by the cinema.",
  "Seat layout shown on VYBZ is representational. Actual seating may vary slightly by auditorium.",
  "3D glasses, where applicable, are charged separately and must be returned after the show.",
  "Recording, photography and smoking inside the auditorium are strictly prohibited.",
  "Please follow the censor certification and age guidelines printed on your ticket.",
] as const;

export const LANGUAGE_LABELS: Record<string, { en: string; native: string }> = {
  telugu: { en: "Telugu", native: "తెలుగు" },
  hindi: { en: "Hindi", native: "हिन्दी" },
  english: { en: "English", native: "English" },
  tamil: { en: "Tamil", native: "தமிழ்" },
  kannada: { en: "Kannada", native: "ಕನ್ನಡ" },
  malayalam: { en: "Malayalam", native: "മലയാളം" },
};

export function languageDisplay(id: string) {
  const key = id.toLowerCase();
  return (
    LANGUAGE_LABELS[key] ?? {
      en: id.charAt(0).toUpperCase() + id.slice(1),
      native: id.charAt(0).toUpperCase() + id.slice(1),
    }
  );
}

export { isPanIndiaMovie } from "@/lib/movies/panIndia";
