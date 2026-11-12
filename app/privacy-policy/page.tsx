import { PolicyPage, type PolicySection } from "@/components/legal/PolicyPage";

export const metadata = { title: "Privacy Policy" };

const sections: PolicySection[] = [
  {
    heading: "Information we collect",
    points: [
      "Account details: your name, phone number, email address, gender, city and profile photo.",
      "Booking details: movies, events, activities and sports slots you book, seat choices, booking IDs and ticket history.",
      "Payment details: transaction IDs and payment status. Card numbers, UPI PINs and CVVs are handled by our payment partner (Razorpay) and are never stored by VYBE.",
      "Location: your selected city, and your device location only if you allow it, so we can show venues near you.",
      "Device and usage data: browser type, device, pages visited and crash logs, used to keep the site fast and secure.",
    ],
  },
  {
    heading: "How we use your information",
    points: [
      "To confirm bookings, send tickets and QR codes, and share booking updates by SMS, email or notifications.",
      "To process payments, cancellations and refunds.",
      "To show movies, events, activities and venues relevant to your city and interests.",
      "To give you rewards such as scratch cards and offers.",
      "To prevent fraud, misuse and unauthorised access to your account.",
    ],
  },
  {
    heading: "Who we share it with",
    points: [
      "Partners (cinemas, organisers, activity operators and venues) receive only the details needed to honour your booking, such as your name, phone number and booking ID.",
      "Payment partners receive the details needed to complete your transaction.",
      "Service providers who host our site or send messages for us, under strict confidentiality agreements.",
      "Law enforcement or government authorities, only when required by law.",
      "We never sell your personal information to anyone.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "We use cookies and local storage to keep you signed in, remember your city and theme (light or dark), and understand how the site is used. You can clear or block cookies from your browser settings, but some features may stop working.",
    ],
  },
  {
    heading: "Data security and retention",
    points: [
      "All data is sent over encrypted (HTTPS) connections.",
      "Access to personal data is limited to team members who need it to support you.",
      "Booking and payment records are kept as long as required for tax and legal purposes. Other data is deleted when you delete your account.",
    ],
  },
  {
    heading: "Your choices and rights",
    points: [
      "View and edit your profile details anytime from Profile → Edit profile.",
      "Turn notifications on or off from Settings.",
      "Unsubscribe from promotional emails using the link at the bottom of any email.",
      "Request a copy of your data, or ask us to delete your account, by writing to hello@vybe.app.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "VYBE is meant for users aged 18 and above. Younger users may book only with the involvement of a parent or guardian. Age-restricted movies and events require valid ID at the venue.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. When we make significant changes, we will notify you on the site or by email. The date at the top shows when it was last updated.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      updated="12 November 2026"
      intro="Your privacy matters to us. This policy explains what information VYBE collects when you browse or book movies, events, activities and sports venues, how we use it, and the choices you have."
      sections={sections}
      current="/privacy-policy"
    />
  );
}
