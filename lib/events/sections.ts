export type EventSection = {
  id: string;
  name: string;
  price: number;
  tone: string;
};

const DEFS = [
  { id: "silver", name: "Silver", multiplier: 1, tone: "#d5e07a" },
  { id: "gold", name: "Gold", multiplier: 1.17, tone: "#f0c27a" },
  { id: "platinum", name: "Platinum", multiplier: 4, tone: "#d7c6f5" },
  { id: "solitaire", name: "Solitaire", multiplier: 2.2, tone: "#b7ddf2" },
  { id: "fanpit", name: "Fanpit", multiplier: 6.5, tone: "#f4b6d0" },
] as const;

export function eventSections(base: number): EventSection[] {
  return DEFS.map((section) => ({
    id: section.id,
    name: section.name,
    tone: section.tone,
    price: Math.max(1, Math.round(base * section.multiplier)),
  }));
}

export function findEventSection(base: number, id: string) {
  return eventSections(base).find((section) => section.id === id) ?? eventSections(base)[0];
}
