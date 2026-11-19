import { PolicyPage } from "@/components/legal/PolicyPage";
import { playTermsSections, playTermsUpdated } from "@/lib/data/playBookingTerms";
import { termsNav } from "@/lib/data/termsOfService";

export const metadata = { title: "Play Booking Terms" };

export default function PlayBookingTermsPage() {
  return (
    <PolicyPage
      title="Play"
      updated={playTermsUpdated}
      sections={playTermsSections}
      current="/policies/play"
      nav={termsNav}
      numbered
      showToc
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/policies/play", label: "Play" },
        { label: "Play" },
      ]}
    />
  );
}
