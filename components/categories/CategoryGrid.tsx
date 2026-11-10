import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CategoryCard } from "@/components/categories/CategoryCard";
import type { CategoryCardData } from "@/types/category";

type CategoryGridProps = {
  categories: CategoryCardData[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="w-full py-8 md:py-10">
      <Container>
        <SectionHeader
          eyebrow="Categories"
          title="Explore by Experience"
          href="/play"
        />
        <div className="overflow-x-auto pb-2 md:overflow-visible">
          <div className="flex w-full min-w-[680px] items-end gap-3 md:min-w-0 md:gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
