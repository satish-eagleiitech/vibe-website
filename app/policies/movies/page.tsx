import { PolicyPage } from "@/components/legal/PolicyPage";
import { movieTermsSections, movieTermsUpdated } from "@/lib/data/movieBookingTerms";
import { termsNav } from "@/lib/data/termsOfService";

export const metadata = { title: "Movies Booking Terms" };

export default function MoviesBookingTermsPage() {
  return (
    <PolicyPage
      title="Movies"
      updated={movieTermsUpdated}
      sections={movieTermsSections}
      current="/policies/movies"
      nav={termsNav}
      numbered
      showToc
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/policies/movies", label: "Movies" },
        { label: "Movies" },
      ]}
    />
  );
}
