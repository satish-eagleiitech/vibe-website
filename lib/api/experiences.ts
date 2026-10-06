import { getPlayItems } from "@/lib/api/play";
import type { ExperienceListResult } from "@/types/experience";

/**
 * @deprecated Use getPlayItems from `@/lib/api/play`.
 * Kept so older imports do not break during the Experiences → Play migration.
 */
export async function getExperiences(): Promise<ExperienceListResult> {
  const result = await getPlayItems();
  return {
    source: result.source,
    items: result.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.venue,
      price: item.price,
    })),
  };
}
