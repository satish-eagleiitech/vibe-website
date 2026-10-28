import { Sparkles } from "lucide-react";
import { ProfileGateLink } from "@/components/navbar/ProfileLink";
import { Container } from "@/components/common/Container";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import type { Recommendation } from "@/types/recommendation";

type RecommendationsSectionProps = {
  items: Recommendation[];
  name?: string;
};

export function RecommendationsSection({
  items,
  name = "there",
}: RecommendationsSectionProps) {
  return (
    <section className="w-full py-10 md:py-12">
      <Container>
        <div className="rounded-3xl bg-[#F3F5F8] p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-white shadow-md">
                <Sparkles className="size-6" />
              </span>
              <div>
                <h3 className="text-2xl font-extrabold text-text">
                  Picked for you, {name}
                </h3>
                <p className="text-sm text-text-secondary">
                  Curated from action blockbusters, live gigs, and weekend coffee
                  runs
                </p>
              </div>
            </div>
            <ProfileGateLink className="self-start rounded-full bg-surface px-6 py-2 text-xs font-semibold text-text shadow-sm transition-colors hover:bg-[#F0F0F0] md:self-auto">
              Manage Preferences
            </ProfileGateLink>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <RecommendationCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
