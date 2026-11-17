import { PolicyPage, type PolicySection } from "@/components/legal/PolicyPage";

export const metadata = { title: "Terms of Service" };

const sections: PolicySection[] = [
  {
    heading: "Agreement to these terms",
    paragraphs: [
      "By browsing or booking on VYBE you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.",
      "VYBE is a discovery and ticketing platform. Movies, events, activities and sports venues are fulfilled by independent partners. Your contract for the experience itself is with that partner.",
    ],
  },
  {
    heading: "Accounts",
    points: [
      "You must provide accurate phone and profile details and keep them up to date.",
      "You are responsible for activity on your account. Do not share OTPs or login codes.",
      "We may suspend accounts that show fraud, abuse or repeated policy breaches.",
    ],
  },
  {
    heading: "Bookings and payments",
    points: [
      "A booking is confirmed only after successful payment and a booking ID is issued.",
      "Prices, seats, slots and availability can change until payment completes.",
      "Convenience fees and taxes shown at checkout form part of the payable amount.",
      "Payments are processed by our payment partners. VYBE does not store full card numbers or UPI PINs.",
    ],
  },
  {
    heading: "Tickets and entry",
    points: [
      "Show the booking QR (or the booking ID) at the venue. Screenshots are accepted unless the partner says otherwise.",
      "Age-restricted content may require a valid photo ID at entry.",
      "Partners may refuse entry for safety, capacity or policy reasons. Where that happens because of partner rules, their policy applies.",
    ],
  },
  {
    heading: "Cancellations and refunds",
    paragraphs: [
      "Cancellations and refunds follow the Cancellation & Refund Policy and the partner rules shown before you pay. Event tickets are generally non-cancellable unless the organiser cancels or reschedules.",
    ],
  },
  {
    heading: "Acceptable use",
    points: [
      "Do not scrape, reverse-engineer or overload the site.",
      "Do not resell tickets in ways that break partner or local rules.",
      "Do not post illegal, harmful or misleading content when listing events or venues.",
    ],
  },
  {
    heading: "Partners who list on VYBE",
    paragraphs: [
      "Organisers and venue owners who list through List your events or List your venue must provide accurate information, honour confirmed bookings, and follow the organiser or venue agreement presented during onboarding.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "VYBE provides the platform on an as-is basis. To the fullest extent allowed by law we are not liable for partner performance, venue conditions, show quality, or losses beyond the amount you paid for the affected booking.",
      "Nothing in these terms limits rights you have under applicable consumer law that cannot be waived.",
    ],
  },
  {
    heading: "Changes",
    paragraphs: [
      "We may update these terms from time to time. The date at the top shows the latest version. Continued use after changes means you accept the updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="16 November 2026"
      intro="These terms govern how you use VYBE to discover and book movies, events, activities and play venues across India."
      sections={sections}
      current="/terms-of-service"
    />
  );
}
