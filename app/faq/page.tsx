import { ChevronDown } from "lucide-react";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata = { title: "FAQs" };

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Bookings & tickets",
    items: [
      {
        q: "Where can I find my tickets?",
        a: "Open Profile → Bookings. Filter by Movies, Events, Activities or Play, then tap View ticket to see the QR code, seats and venue details.",
      },
      {
        q: "Do I need to print my ticket?",
        a: "No. Show the QR code on your phone at the venue entry. Keep your screen brightness up so it scans quickly.",
      },
      {
        q: "I didn't get a confirmation SMS or email. Is my booking confirmed?",
        a: "If the booking appears under Profile → Bookings, it is confirmed. Messages can sometimes be delayed by your network or land in spam.",
      },
      {
        q: "Can I change the seats, date or time after booking?",
        a: "Bookings can't be edited once confirmed. You can cancel (where the partner allows it) and book again.",
      },
    ],
  },
  {
    title: "Cancellations & refunds",
    items: [
      {
        q: "How do I cancel a booking?",
        a: "Go to Profile → Bookings, open the ticket and tap Cancel booking. The refund amount is shown before you confirm.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are credited to the same payment method within 5–7 working days of the cancellation.",
      },
      {
        q: "Can I cancel event tickets?",
        a: "Event tickets are non-refundable unless the organiser cancels or reschedules the event. In that case you get a full refund.",
      },
      {
        q: "What is the cancellation window for sports venues?",
        a: "Play bookings can be cancelled for free up to 6 hours before your slot.",
      },
    ],
  },
  {
    title: "Payments & offers",
    items: [
      {
        q: "Which payment methods are accepted?",
        a: "UPI, debit and credit cards, net banking and popular wallets, all processed securely through Razorpay.",
      },
      {
        q: "Money was debited but my booking failed. What now?",
        a: "Don't worry. The amount is refunded automatically to your payment source within 5–7 working days.",
      },
      {
        q: "How do scratch cards work?",
        a: "Every booking unlocks a scratch card in Rewards. Scratch it to reveal a discount code you can use on your next booking.",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        q: "How do I change my city?",
        a: "Tap the city name in the header, or update it from Profile → Edit profile.",
      },
      {
        q: "How do I edit my name, phone number or photo?",
        a: "Go to Profile and tap Edit profile to change your name, phone, email, gender, city and photo.",
      },
      {
        q: "How do I delete my account?",
        a: "Write to hello@vybe.app from your registered email. Your account and personal data are deleted within 30 days, except records we must keep by law.",
      },
    ],
  },
  {
    title: "Venues & partners",
    items: [
      {
        q: "How can I list my event or venue on VYBE?",
        a: "Use List your events or List your venue in the footer. Our partner team will get in touch within 2 working days.",
      },
      {
        q: "Are bats, rackets and balls provided at sports venues?",
        a: "It depends on the venue. Check the amenities on the venue page, which list rentals such as bats, paddles and balls.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <PolicyPage
      eyebrow="Help"
      title="Frequently Asked Questions"
      updated="12 November 2026"
      intro="Quick answers about booking, tickets, cancellations, payments and your VYBE account."
      current="/faq"
    >
      {groups.map((group) => (
        <article
          key={group.title}
          className="rounded-[20px] border border-border bg-surface p-5 md:p-6"
        >
          <h2 className="text-[16px] font-extrabold text-text md:text-[17px]">{group.title}</h2>
          <div className="mt-2 divide-y divide-border">
            {group.items.map((item) => (
              <details key={item.q} className="group py-3.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-bold text-text [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="size-4 shrink-0 text-text-muted transition-transform group-open:rotate-180 group-open:text-text" />
                </summary>
                <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{item.a}</p>
              </details>
            ))}
          </div>
        </article>
      ))}
    </PolicyPage>
  );
}
