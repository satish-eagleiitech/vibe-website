export type ScratchCard = {
  id: string;
  category: string;
  reward: string;
  detail: string;
  code: string | null;
  expires: string;
};

export const SCRATCH_CARDS: ScratchCard[] = [
  {
    id: "sc-movie75",
    category: "Movies",
    reward: "₹75 off",
    detail: "On 2 or more movie tickets",
    code: "MOVIE75",
    expires: "Valid till 31 Oct",
  },
  {
    id: "sc-dessert",
    category: "Dining",
    reward: "Free dessert",
    detail: "With any table booking",
    code: "SWEETVYBE",
    expires: "Valid till 15 Oct",
  },
  {
    id: "sc-bowling",
    category: "Game Zone",
    reward: "1 free game",
    detail: "Bowling at Inorbit Mall",
    code: "STRIKE1",
    expires: "Valid till 20 Oct",
  },
  {
    id: "sc-oops",
    category: "Surprise",
    reward: "Better luck next time",
    detail: "Your next booking brings a new card",
    code: null,
    expires: "",
  },
  {
    id: "sc-event10",
    category: "Events",
    reward: "10% off",
    detail: "On any event pass",
    code: "EVENT10",
    expires: "Valid till 30 Nov",
  },
  {
    id: "sc-adventure",
    category: "Activities",
    reward: "₹100 off",
    detail: "Adventure park day pass",
    code: "ADV100",
    expires: "Valid till 12 Nov",
  },
];

const KEY = "vybe-scratch-revealed";
export const SCRATCH_EVENT = "vybe-scratch-updated";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function readRevealed(): string[] {
  if (!canUseStorage()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function revealCard(id: string) {
  const current = readRevealed();
  if (current.includes(id) || !canUseStorage()) return;
  window.localStorage.setItem(KEY, JSON.stringify([...current, id]));
  window.dispatchEvent(new Event(SCRATCH_EVENT));
}

export function unscratchedCount() {
  const revealed = new Set(readRevealed());
  return SCRATCH_CARDS.filter((card) => !revealed.has(card.id)).length;
}
