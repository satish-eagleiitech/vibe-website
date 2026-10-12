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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
