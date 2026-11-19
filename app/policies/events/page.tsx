import { PolicyPage } from "@/components/legal/PolicyPage";
import { eventTermsSections, eventTermsUpdated } from "@/lib/data/eventBookingTerms";
import { termsNav } from "@/lib/data/termsOfService";

export const metadata = { title: "Event Terms" };

export default function EventBookingTermsPage() {
  return (
    <PolicyPage
      title="Event Terms"
      updated={eventTermsUpdated}
      sections={eventTermsSections}
      current="/policies/events"
      nav={termsNav}
      numbered
      showToc
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/policies/events", label: "Events" },
        { label: "Event Terms" },
      ]}
    />
  );
}
