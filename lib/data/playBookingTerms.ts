import type { PolicySection } from "@/components/legal/PolicyPage";

export const playTermsUpdated = "01 November 2026";

export const playTermsSections: PolicySection[] = [
  {
    id: "introduction",
    heading: "Introduction",
    paragraphs: [
      "VYBZ facilitates the booking of time-bound slots for Activities as defined below between Merchants and the Customers.",
      'By booking any slot at a Facility through the Platform, you agree to be bound by these terms and conditions (**"Facility Terms"**). Through the Platform, we provide you with information in relation to Activities (as defined below) organised by Merchants at the Facility, including slots details, location, pricing, slot availability, and other related information, and facilitate the booking of such slots.',
      '**"Facility(ies)"** shall mean any and all premises including sports venues, fitness centres, coaching sessions, grounds, courts, gyms, halls, amenities arenas, and any other physical infrastructure or services offered by Merchants from time to time on the Platform, which are made available to Customers on a time-slot basis.',
      '**"Activity(ies)"** shall mean the sports and recreational activities and other related services offered by the Merchant at the Facilities.',
    ],
  },
  {
    id: "facility-specific",
    heading: "Facility-specific terms",
    paragraphs: [
      "It is clarified that terms and conditions specific to a Facility in respect of which VYBZ has facilitated booking of slots through the Platform shall be published on the Platform. In the event of any conflict between the terms and conditions specific to a Facility, and these Facility Terms, including the cancellation and refund policy, the respective Facility terms and conditions shall be binding.",
    ],
  },
  {
    id: "payment-methods",
    heading: "Payment Methods",
    paragraphs: [
      "We accept Visa, MasterCard, American Express, Debit Cards, International Cards, Net Banking, Paytm Wallet, UPI, and PayU Money through the integrated booking system available only on the Platform. We may introduce alternate modes of payment in the future, at our sole discretion, which shall be communicated on the Platform.",
      "VYBZ reserves the right to charge a **'Convenience Fee'** in respect of any of its Services as may be communicated on the Platform from time to time. By making a transaction or making a booking, you agree to pay for such charges. These charges may vary from transaction to transaction, which shall be based on multiple factors such as cart value, time of the day, time taken, seasonal peaks or such other parameters, as determined from time to time. The Convenience Fee is non-refundable except for the slots which are cancelled by the Merchant(s).",
    ],
  },
  {
    id: "pricing-confirmation",
    heading: "Pricing, offers, availability, and slot confirmation",
    points: [
      "(a) Platform is, inter alia, a Facility and slot aggregator and sells slots for the Facilities on behalf of Merchants and therefore has no control over its availability, offers, and pricing.",
      "(b) After the payment is complete, you will receive a confirmation page or email that must be shown at the respective Facility to avail/utilize your slot booking.",
      "(c) VYBZ shall not be responsible for non-delivery of the confirmation e-mail or any other e-mails relating to the slot booking process not being delivered to your primary e-mail inbox.",
      "(d) If you do not receive a confirmation number after submitting payment information, or if you experience an error message or service interruption after submitting payment information, please get in touch with our customer service team to confirm whether the order has been placed or not. VYBZ shall not be responsible for any losses occurred during this process, due to any default on the part of banks, payment aggregators etc. or for reasons not attributable to VYBZ.",
    ],
  },
  {
    id: "accepted-payments",
    heading: "Accepted payment methods",
    paragraphs: [
      "The following payment methods are supported on the Platform for Play slot bookings (subject to availability at checkout):",
    ],
    table: {
      headers: ["Method", "Examples"],
      rows: [
        ["Cards", "Visa, MasterCard, American Express, Debit Cards, International Cards"],
        ["Banking", "Net Banking"],
        ["Wallets / UPI", "Paytm Wallet, UPI"],
        ["Other gateways", "PayU Money and other integrated methods on the Platform"],
      ],
    },
  },
  {
    id: "cancellation-policy",
    heading: "Cancellation Policy",
    paragraphs: [
      "This cancellation policy governs the cancellation, rescheduling, and refund process for Customers booking slots at Facilities through the Platform.",
      "(a) Cancellations by Customer: Customers may cancel their slot bookings through the Platform, subject to the following refund structure based on the time of cancellation prior to the scheduled slot:",
    ],
    table: {
      headers: ["Time Before Slot Start", "Refund Eligibility"],
      rows: [
        ["More than 24 hours", "100% refund of the base booking price"],
        ["12 to 24 hours", "50% refund of the base booking price"],
        ["0 to 12 hours / No-show", "No refund"],
      ],
    },
    subsections: [
      {
        paragraphs: [
          "For the purpose of clarification, **'convenience fee'**, if any, charged by VYBZ shall not be refunded.",
          "(b) Cancellations by Merchants/Facilities: In the event the Merchant cancels the slot due to operational reasons, weather, technical failures, or overbooking:",
        ],
        points: [
          "Customers will receive a 100% refund.",
          "If the Customer opts for it, the slot may be rescheduled at no additional cost provided the booking price of the rescheduled slot is the same. In the event the rescheduled event carries a greater booking price than the cancelled slot, the Customer will be required to make the difference amount on the Platform.",
          "Refunds, if any, with respect to the cancellation of bookings, will be processed by the Platform within 5–7 business days. All refunds shall be processed back to source.",
        ],
      },
    ],
  },
  {
    id: "additional-terms",
    heading: "Additional Terms",
    points: [
      "(a) In case the Facility is not accessible or not fit to use/play due to rain or other natural causes, the booking may be cancelled by VYBZ at its discretion and subject to availability.",
      "(b) Notwithstanding anything contained under these terms, repeated last-minute cancellations, no-shows or any fraudulent activity may lead to account suspension.",
      "(c) VYBZ accepts no liability for any damages caused to you because of any error, inaccuracy, defect, omission, or interruption of third parties who provide equipment rental services, food & beverage services, etc. at the Facility(ies).",
      "(d) VYBZ shall not be responsible for any personal injury, death, property loss, or any other incident occurring at the Facility(ies).",
      "(e) The Customer hereby assumes all risks, whether or not expressly set forth in these Facility Terms, as well as any risks or dangers incidental to, or in any way relating to, the Facilities, the purchase of slots hereunder including those arising from, or relating to, the acts or omissions of third parties (including artists, performers, Merchant(s), operators, Merchant(s) staff, employees or agents or any other representatives or affiliates of the Merchant), loss, theft or damage to any personal property, trauma, shock, stress, assault or personal injury sustained by you, whether such injuries or manifestations of such injuries occur before, during or subsequent to the Activity(ies). VYBZ shall have no legal obligation to mitigate your potential or actual losses sustained before, during or subsequent to the Activity(ies).",
      "(f) You agree and acknowledge that VYBZ does not have control over, and makes no representation or endorsement regarding the accuracy, relevancy, copyright compliance, legality, completeness, timeliness or quality of any product, services, advertisements and other content appearing in or linked to the Facilities and/or Activities. You are requested to verify the accuracy of all information on your own before booking any slot or reliance on such information.",
      "(g) In no event shall VYBZ be liable for any direct, indirect, punitive, incidental, special, consequential damages or any other damages resulting from: (a) the use of or inability to use the services and/or benefits pertaining to the Facilities and/or Activities; (b) the cost of procurement of any substitute goods and/or services or any loss/damage resulting from purchase of any goods or services or transactions entered into at the Facilities and/or Activities; and (c) any other matter relating to the Facilities and/or Activities; including, without limitation, damages for loss arising out of or in any way connected with the Facilities and/or Activities.",
      "(h) For any help or queries pertaining to any Facilities, you may reach out to us through chat support or other channels as communicated on the Platform or write to us at hello@vybz.app.",
    ],
  },
];
