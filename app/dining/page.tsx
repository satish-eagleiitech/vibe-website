import { AllDiningSection } from "@/components/dining/AllDiningSection";
import { DiningHero } from "@/components/dining/DiningHero";
import { DiningMoodSection } from "@/components/dining/DiningMoodSection";
import { NearbyDiningSection } from "@/components/dining/NearbyDiningSection";
import { diningMoods, matchesDiningMood } from "@/lib/data/diningMoods";
import { getDiningSpots } from "@/lib/api/dining";

export const metadata = {
  title: "Dining",
};

export default async function DiningPage({
  searchParams,
}: {
  searchParams: Promise<{
    mood?: string;
    cuisine?: string;
    area?: string;
    price?: string;
  }>;
}) {
  const { mood, cuisine, area, price } = await searchParams;
  const result = await getDiningSpots();
  const nearby = result.items.slice(0, 8);
  const filtered = result.items.filter((spot) => matchesDiningMood(spot, mood));
  const moodLabel = diningMoods.find((item) => item.id === mood)?.label;

  return (
    <div className="w-full pb-12">
      <DiningHero spots={result.items} />
      <div id="mood-section" className="scroll-mt-[calc(var(--vybe-header-h)+1.5rem)]">
        <DiningMoodSection activeMood={mood} />
      </div>
      {mood ? (
        <NearbyDiningSection
          spots={filtered}
          title={`${moodLabel ?? "Mood"} restaurants`}
          anchorId="mood-restaurants"
        />
      ) : null}
      <NearbyDiningSection spots={nearby} />
      <AllDiningSection
        spots={result.items}
        mood={mood}
        cuisine={cuisine}
        area={area}
        price={price}
      />
    </div>
  );
}
