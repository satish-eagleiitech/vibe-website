import { PolicyPage } from "@/components/legal/PolicyPage";
import {
  privacySections,
  privacySubtitle,
  privacyUpdated,
} from "@/lib/data/privacyPolicy";
import { termsNav } from "@/lib/data/termsOfService";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      subtitle={privacySubtitle}
      updated={privacyUpdated}
      sections={privacySections}
      current="/privacy-policy"
      nav={termsNav}
      showToc
    />
  );
}
