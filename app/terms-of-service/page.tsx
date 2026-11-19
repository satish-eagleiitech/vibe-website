import { PolicyPage } from "@/components/legal/PolicyPage";
import {
  termsIntro,
  termsNav,
  termsSections,
  termsUpdated,
} from "@/lib/data/termsOfService";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      updated={termsUpdated}
      intro={termsIntro}
      sections={termsSections}
      current="/terms-of-service"
      nav={termsNav}
      showToc
    />
  );
}
