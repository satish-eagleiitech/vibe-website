import { PolicyPage, type PolicySection } from "@/components/legal/PolicyPage";

export const metadata = { title: "Cancellation & Refund Policy" };

const sections: PolicySection[] = [
  {
    heading: "Who sets the cancellation policy",
    paragraphs: [
      "VYBE sells tickets and slots on behalf of cinemas, event organisers, activity operators and sports venues (our partners). Cancellations are subject to the policy set by the respective partner.",
      "You can see the partner's cancellation policy on the movie, event, activity or venue page before you book. The same policy is also printed on your booking ticket under Profile → Bookings.",
    ],
  },
  {
    heading: "How to cancel a booking",
    points: [
      "Open Profile → Bookings and select the ticket you want to cancel.",
      "Tap Cancel booking. The refund amount due to you is shown before you confirm the cancellation.",
      "Once confirmed, you will receive a cancellation confirmation by SMS and email.",
      "If the Cancel option is not visible, the booking is not cancellable under the partner's policy.",
    ],
  },
  {
    heading: "Cancellation rules by category",
    points: [
      "Movies: tickets can be cancelled from the ticket page before showtime, where the cinema allows cancellation. Food and beverage add-ons are refunded only if the cinema permits it.",
      "Events: tickets are non-cancellable and non-refundable unless the organiser cancels or reschedules the event.",
      "Activities: cancellation is allowed only as per the operator's policy shown at checkout. Date-specific passes cannot be moved to another date.",
      "Play (sports venues): free cancellation up to 6 hours before your slot. Cancellations within 6 hours of the slot, or no-shows, are not refunded.",
    ],
  },
  {
    heading: "Refund timelines",
    paragraphs: [
      "The refund amount will be credited back to the same source through which the payment was made (UPI, card, net banking or wallet) within 5–7 working days of the cancellation.",
      "Bank processing times may vary. If you have not received your refund after 7 working days, contact us with your booking ID.",
    ],
  },
  {
    heading: "Fees and deductions",
    points: [
      "Convenience fees and payment gateway charges are non-refundable, unless the show, event or slot is cancelled by the partner.",
      "Discounts and scratch-card rewards used on a cancelled booking are not reissued.",
      "Taxes are refunded in proportion to the refunded ticket amount.",
    ],
  },
  {
    heading: "Cancelled or rescheduled by the partner",
    points: [
      "If a show, event, activity or slot is cancelled by the partner, you get a full refund including the convenience fee. No action is needed from you.",
      "If an event is rescheduled, your ticket stays valid for the new date. If you can't attend, you may request a refund within the window announced by the organiser.",
    ],
  },
  {
    heading: "Failed or duplicate payments",
    paragraphs: [
      "If money is debited but no booking is confirmed, or you are charged twice for the same booking, the amount is refunded automatically to the source within 5–7 working days.",
    ],
  },
];

export default function RefundPage() {
  return (
    <PolicyPage
      title="Cancellation & Refund Policy"
      updated="12 November 2026"
      intro="This policy explains when you can cancel a booking made on VYBE, how much is refunded, and when the money reaches you."
      sections={sections}
      current="/refund-policy"
    />
  );
}
