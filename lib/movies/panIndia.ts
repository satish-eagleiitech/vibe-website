/** Known pan-India / multi-language releases on VYBZ. */
const BY_ID: Record<string, string[]> = {
  "1003596": ["english", "telugu", "hindi", "tamil", "kannada"], // Avengers: Doomsday
  "1257973": ["telugu", "hindi", "tamil"], // Fauzi
  "1234139": ["tamil", "telugu", "hindi", "kannada"], // Jailer 2
};

const TITLE_HINT =
  /ramayan|avenger|pushpa|kalki|salaar|jailer|bahubali|rrr|kgf|animal|jawan|pathaan|war\s*2|coolie|they\s*call\s*him\s*og|devara|game\s*changer|fauzi/i;

function unique(list: string[]) {
  return Array.from(new Set(list.map((item) => item.toLowerCase()).filter(Boolean)));
}

/** Expand languages for pan-India titles so booking can offer Telugu / Hindi / etc. */
export function withPanIndiaLanguages(
  id: string,
  title: string,
  languages: string[],
): string[] {
  const override = BY_ID[id];
  if (override) return unique([...languages, ...override]);
  if (TITLE_HINT.test(title)) {
    return unique([...languages, "telugu", "hindi", "tamil", "kannada"]);
  }
  return unique(languages);
}

export function isPanIndiaMovie(languages: string[]) {
  return unique(languages).length >= 2;
}
