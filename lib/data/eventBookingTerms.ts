import type { PolicySection } from "@/components/legal/PolicyPage";

export const eventTermsUpdated = "01 November 2026";

export const eventTermsSections: PolicySection[] = [
  {
    id: "introduction",
    heading: "Introduction",
    paragraphs: [
      "VYBE facilitates the sale and purchase of event tickets between the Merchants and the Customers. By purchasing tickets for the Event (as defined below), you agree to be bound by these Event Terms. Through the Platform, we provide to you information in relation to Events that are organized by Merchants (third-party entities) including the Event dates, venue, ticket pricing and other Event-related information, and facilitates sale of tickets to such Events. However, when you purchase a ticket for any Event, show, or content available on the Platform, you agree that for any issue or grievance under these Event Terms, your recourse shall be solely to VYBE.",
      '**"Event"** shall include parties, plays, concerts, any other events or special packages, hosted and/or curated by Merchants, from time to time listed on the Platform.',
      "VYBE reserves the right to charge a **'Convenience Fee'** in respect of any of its Services, which shall be communicated on the Platform from time to time. By making a transaction or making a booking, you agree to pay for such charges. These charges may vary from transaction to transaction, which shall be based on multiple factors such as cart value, time of the day, time taken, seasonal peaks or such other parameters, as determined from time to time. The Convenience Fee is non-refundable except for the Event(s) which are cancelled by the Merchant(s).",
      "It is clarified that terms and conditions specific to an Event in respect of which VYBE has facilitated sale of tickets through the Platform shall be published on the Event page accessible on the Platform. In the event of any conflict between the Event-related terms and conditions, and these terms, you agree that the Event-related terms and conditions shall prevail and be binding on you at all times.",
    ],
  },
  {
    id: "payment-methods",
    heading: "Payment Methods",
    paragraphs: [
      "We accept Visa, MasterCard, American Express, Debit Cards, International Cards, Net Banking, Paytm Wallet, UPI, and PayU Money through the integrated ticketing system available only on the Platform. For certain events, we will also accept offline payment modes including cash/cheques only through authorised promoters, whose details will be listed on the respective event pages. If you are purchasing tickets from anywhere outside of Platform, including through any authorized promoters, it shall be completely your own responsibility to verify the genuineness of the source and authenticity of the ticket issued to you.",
    ],
    table: {
      headers: ["Method", "Notes"],
      rows: [
        ["Cards", "Visa, MasterCard, American Express, Debit Cards, International Cards"],
        ["Banking / wallets", "Net Banking, Paytm Wallet, UPI, PayU Money"],
        ["Offline (selected events)", "Cash / cheques only via authorised promoters listed on the event page"],
      ],
    },
  },
  {
    id: "pricing-confirmation",
    heading: "Pricing, offers, availability, and seat confirmation",
    points: [
      "(a) Platform is a ticketing platform and sells tickets on behalf of Merchants and therefore has no control over its availability, offers, and pricing. If the Merchant announces any offer for the Event, such an offer will not apply to the tickets purchased before the announcement of the offer.",
      "(b) After the payment is complete, you will receive a confirmation page or email that must be shown at the event venue to redeem your tickets.",
      "(c) If you do not receive a confirmation number after submitting payment information, or if you experience an error message or service interruption after submitting payment information, please get in touch with our customer service department to confirm whether the order has been placed or not.",
      "(d) While purchasing tickets, you are limited to a specific number of tickets you can buy per event.",
    ],
  },
  {
    id: "cancellations",
    heading: "Cancellations, exchanges and refunds",
    paragraphs: [
      "ANY TICKET PURCHASED THROUGH THE PLATFORM IS MEANT SOLELY AND EXCLUSIVELY FOR PERSONAL USE BY THE PERSON IN WHOSE NAME THE TICKET HAS BEEN ISSUED. TICKETS ARE NOT A TRANSFERABLE PROPERTY AND CANNOT BE RESOLD, TRANSFERRED OR CONVEYED TO ANY PERSON UNLESS PRIOR WRITTEN AND EXPRESS PERMISSION HAS BEEN PROVIDED BY THE MERCHANT. ANY PERSON FOUND ABUSING TICKETS FOR PERSONAL GAIN OR FOR COMMERCIAL USE SHALL BE LIABLE TO SUITABLE LEGAL PROCEEDINGS INCLUDING THOSE RELATED TO BLACK MARKETING AND FINANCIAL & CRIMINAL FRAUD.",
    ],
    points: [
      "(a) If VYBE or the Merchant finds that you are transferring or selling, or you had in the past transferred or sold, your tickets, including m-ticket or band, through any mode, including social media platforms, other ticketing platforms, by hand, thereby allowing any other person to access the Event without purchasing the ticket from Platform, then VYBE or the Merchant may initiate suitable legal proceedings.",
      "(b) Tickets once sold cannot be exchanged, cancelled, modified, transferred, or refunded, and you shall not make any request for modifications in the ticket, including change in date, time, location, or category unless the Merchant has specified so in the Event's terms and conditions. Please make sure you check the date, time, and location before you book your tickets.",
      "(c) If an Event is cancelled and the Merchant of such Event agrees on issuing a refund for the tickets, it shall be the Merchant's responsibility to instruct VYBE to communicate and contact you and process the refund and VYBE shall have no liability in this regard. If an Event gets postponed to a later date, the Merchant at its sole discretion may give you an option to attend the Event on a rescheduled date or if you don't wish to attend the Event you may avail a refund within a specific duration communicated to you by VYBE. Any claim or demand for refund in respect of an Event that has already been conducted, whether arising from alleged dissatisfaction with the overall event quality and experience, venue conditions, technical issues, service deficiencies or any act or omission whatsoever, shall be raised by You within seventy-two (72) hours from the date of such Event. Any requests or claims raised after the expiry of the aforesaid period shall be time-barred and shall not be considered under any circumstances. If the Merchant informs VYBE to process the refunds on their behalf, your refunds may reflect in your account within seven (7) to ten (10) working days from the date of receiving the refund request.",
    ],
  },
  {
    id: "refund-policy",
    heading: "Refund Policy",
    points: [
      "(a) Where a cancellation or refund is approved in accordance with these Terms and subject to confirmation and approval by the Merchant, VYBE shall be liable to refund only the ticket price paid by you. For the avoidance of doubt, VYBE shall not be liable to refund any platform fees, convenience fees, booking charges, or any ancillary, incidental, or third-party expenses, including without limitation travel costs, airfare, accommodation, lodging, food, local conveyance, or any other related expenditure incurred by You.",
      "(b) In case you have made the payment but failed to receive any email and/or SMS confirmation, then chances are that such a payment has failed. Once we have confirmed a failed order, we process refunds on our own. While we process such refunds within 3–5 days, it may take up to 7–10 working days (and sometimes more) for your financial institution to credit the amount back to your account.",
      "(c) VYBE reserves the right to deny refunds for tickets purchased outside of Platform. Any decisions taken by the Merchant and VYBE will be final and binding in this regard. If you find that you have been issued fake tickets not authorized by us, then you may be a victim of fraud, for which you may consider filing appropriate police complaints/first information report at the nearest police station having jurisdiction over the area of your residence. We bear no responsibility or liability, under any law or circumstances, for such frauds committed by unauthorized third parties.",
    ],
  },
  {
    id: "ticket-delivery",
    heading: "Ticket Delivery",
    points: [
      "Email confirmation: Your booking confirmation will be sent via an email. This confirmation needs to be printed and shown at the ticket counter to get a physical ticket, if entry to the Event in respect of which such ticket has been booked is subject to presentation of a physical ticket.",
      "SMS / in-app confirmation: Your booking confirmation will be sent via an SMS and/or in-app notification. You may be requested to display the ticket details received along with appropriate identity proofs to receive a physical ticket.",
      "Physical Tickets: In case of physical tickets, we will deliver them to your address confirmed and provided by you on the Platform. However, delivery charges will not be refunded for any reasons beyond VYBE's or its delivery partner's control, including but not limited to your premises being closed at the time of delivery or in case you have provided an incorrect address.",
      "Ticket Pick-Up: If at the time of purchasing physical tickets, you choose to 'pick-up' tickets from a designated location, then the pick-up details shall be intimated to you on the purchase email. You can only pick-up the physical tickets during the pick-up window from the location or address specified in the email and/or SMS confirmation.",
      "It is clarified that if you have chosen the delivery option, then the ticket redemption shall not be available at the box-office at the Event's venue. We will not be able to fulfil your requests for issuing a duplicate ticket or issuing an e-ticket as a replacement.",
      "In all of the above options, you will need to produce the credit or debit card used to purchase the tickets along with a valid government-issued photo ID proof (Driver's license / Aadhaar / Passport) for picking up the tickets at the venue.",
      "Damage: You shall be solely responsible for any damage, loss, destruction, mutilation or wastage of a physical ticket which occurs for any reason except those related to packaging issues. If you received a damaged ticket due to packaging issues, please do not take delivery of the physical ticket and instead hand it back to the delivery supplier. Accepting delivery shall exempt VYBE from all liability for damage to physical tickets arising because of packaging issues. We will not be able to help you redeem the physical tickets if the barcode/QR code is not scannable. In such situations, you will be required to purchase another new ticket(s) to get access to the venue.",
      "For any help or queries pertaining to Event, you may reach out to us through chat support or other channels as communicated on the Platform, or write to hello@vybe.app.",
    ],
  },
  {
    id: "rnpl",
    heading: "RNPL Terms",
    paragraphs: [
      'Attendees may reserve their tickets and any applicable add-ons (as communicated through VYBE) by paying a percentage of the total amount shown at checkout (**"Reservation Amount"** / Pay XX% and reserve). The remaining balance must be paid by the date shown to you on the VYBE application / website while reserving your ticket(s) (**"Due Date"**). Additionally, the Due Date may also be communicated to you through email / SMS / in-app notification.',
    ],
    points: [
      'Only attendees who book tickets and applicable add-ons on VYBE before the date as intimated by VYBE on the application/website (in its sole discretion) are eligible for the "Pay XX% and reserve" option.',
      "Tickets and add-ons will be confirmed only after full payment is successfully received on or before the Due Date.",
      "If the remaining balance is not paid by the Due Date, the reservation will be automatically cancelled and the initial XX% Reservation Amount will be forfeited and non-refundable.",
    ],
    table: {
      headers: ["Step", "What happens"],
      rows: [
        ["At checkout", "Pay the XX% Reservation Amount shown on the Platform"],
        ["Before Due Date", "Pay the remaining balance to confirm tickets and add-ons"],
        ["After Due Date (unpaid)", "Reservation auto-cancelled; Reservation Amount forfeited"],
      ],
    },
  },
  {
    id: "refund-guarantee",
    heading: "Refund Guarantee Terms",
    paragraphs: [
      'Attendees (excluding the attendees who have opted for Pay XX% and reserve) can opt-in to pay the **Refund Guarantee Fee** (as shown on the app) which allows the attendees to cancel eligible tickets up to such date and time as may be communicated by VYBE on the application/website (**"Eligible Date"**) and receive a refund of the ticket value (net of discounts availed) back to the source account. The refund guarantee benefit is limited to a maximum of 10 tickets per transaction per show.',
    ],
    points: [
      "Refund option is only available for customers who have paid the Refund Guarantee Fee.",
      "The Refund Guarantee Fee is non-refundable (except in case of event cancellation).",
      "Notwithstanding anything to the contrary stated elsewhere, refunds shall not be eligible in case of rescheduling and postponing of the Event and any such instance.",
      "Notwithstanding anything contrary stated elsewhere, reserve now pay later feature cannot be availed if Refund Guarantee Fee is availed.",
      "The refund amount shall be limited to the ticket sale amount actually paid by the customer (net of any discounts or promotional offers availed) along with applicable taxes paid on the ticket sale amount. Discounts, travel packages, convenience fees, delivery charges, platform charges, applicable taxes (including GST) and other ancillary and incidental expenses incurred by you (including travel costs) are not included in the refund.",
      "The Refund Guarantee Fee plan must be purchased at the time of ticket booking for the relevant event and cannot be added after the transaction has been completed.",
      "Refund Guarantee is applicable only to valid tickets purchased directly through the VYBE platform. Tickets purchased via resellers, secondary marketplaces, or unauthorised third parties are not eligible.",
      "Refunds under Refund Guarantee Fee plan shall only be applicable where the customer cancels the ticket before the Eligible Date. Cancellations made after the Eligible Date are not eligible for any refund.",
      'The "Refund on Cancellation" feature applies only to cancellations initiated by the customer who originally booked the tickets.',
      'The "Refund on Cancellation" feature plan does not apply and the plan shall be deemed to be null and void if the event is cancelled, postponed, rescheduled, or modified by the organiser, venue, or performer. Any cancellations due to government mandates, travel bans, or acts of God (e.g., extreme weather, terrorism), pandemic-like situations are not covered under this plan.',
    ],
  },
];
