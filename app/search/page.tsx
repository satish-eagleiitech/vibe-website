import { Container } from "@/components/common/Container";
import { SearchResults } from "@/app/search/SearchResults";
import { searchMovies } from "@/lib/api/movies";

export const metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const result = await searchMovies(q);

  return (
    <section className="py-10 md:py-12">
      <Container>
        <h1 className="mb-6 text-[30px] font-extrabold tracking-tight text-text">
          Search
        </h1>
        <SearchResults initialQuery={q} initialMovies={result.items} />
      </Container>
    </section>
  );
}
