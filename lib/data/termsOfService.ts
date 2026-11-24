import type { PolicyNavItem, PolicySection } from "@/components/legal/PolicyPage";

export const termsUpdated = "01 November 2026";

export const termsNav: PolicyNavItem[] = [
  {
    href: "/terms-of-service",
    label: "Terms of Service",
    children: [
      { href: "/policies/movies", label: "Movies" },
      { href: "/policies/events", label: "Events" },
      { href: "/terms-of-service#activities", label: "Activities" },
      { href: "/policies/play", label: "Play" },
    ],
  },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Cancellation & Refund" },
  { href: "/faq", label: "FAQ" },
];

/** Sidebar for the standalone FAQ page — FAQ only */
export const faqNav: PolicyNavItem[] = [{ href: "/faq", label: "FAQ" }];


export const termsIntro =
  "Thank you for using VYBZ. These Terms of Service explain your rights and responsibilities when you access or use the VYBZ website and related applications (collectively, the \"Platform\").";

export const termsSections: PolicySection[] = [
  {
    id: "acceptance",
    heading: "Acceptance of Terms",
    paragraphs: [
      "These Terms of Service (the \"Terms\") are intended to make you aware of your legal rights and responsibilities with respect to your access to and use of the VYBZ Platform under the brand name \"VYBZ\".",
      "Please read these Terms carefully. By accessing or using the Platform, you agree to these Terms and enter into a legally binding contract with VYBZ (\"VYBZ\" / \"We\" / \"Us\" / \"Our\"). You may not use the Platform and/or its Services if you do not accept the Terms or are unable to be bound by them.",
      "By visiting our Platform and/or purchasing something from us, you engage in our Services and agree to be bound by these Terms, including any additional terms and policies referenced herein and/or available by hyperlink on the Platform. These Terms apply to all users of the Platform, including browsers, customers, merchants, and contributors of content.",
      "Your use of the Platform is also governed by our Privacy Policy available on the Platform (\"Privacy Policy\").",
      "These Terms may be updated from time to time. It is recommended that you review them each time you access the Platform. If there is any conflict between these Terms and any other terms on the Platform, these Terms will prevail.",
      "For the purposes of these Terms: \"Customer\" or \"You\" or \"Your\" refers to you as a customer of the Services — someone who accesses or uses the Services for sharing, displaying, hosting, publishing, transacting, or uploading information, views or pictures, including persons jointly participating in the Services.",
      "\"Merchant\" means cinema/theatre partners, event organisers, activity operators, sports facilities/venues, or any other third party onboarded with VYBZ.",
    ],
  },
  {
    id: "services-overview",
    heading: "Services Overview",
    paragraphs: [
      "VYBZ is a platform for Customers to discover and book movies, events, activities, play (sports and recreational venues), and related ticketing listed by Merchants on the Platform from time to time (\"Services\"). Services on the Platform are available in select geographies in India.",
    ],
  },
  {
    id: "eligibility",
    heading: "Eligibility",
    paragraphs: [
      "Persons who are \"incompetent to contract\" within the meaning of the Indian Contract Act, 1872 are not eligible to use the Platform. If you are a minor (under 18 years), you may use the Platform only under the supervision of an adult parent or legal guardian who is competent to contract and agrees to be bound by these Terms.",
      "If you use the Platform on behalf of any person or entity, you represent that you are authorised to accept these Terms on their behalf, and you and such person/entity agree to be jointly and severally liable and to indemnify us for violations of these Terms.",
      "You agree to use the Services only in compliance with these Terms and applicable laws, and in a manner that does not violate our legal rights or those of any third party.",
    ],
  },
  {
    id: "account",
    heading: "Account and Registration Obligations",
    paragraphs: [
      "Users must register and log in to make transactions on the Platform. Keep your account and registration details current and correct so you can receive communications from the Platform. By agreeing to these Terms, you agree to receive transactional, promotional, commercial or other communications and newsletters from us. You can opt out using the options in such communications, or change notification preferences in your profile.",
      "As part of registration and use, we may collect personally identifiable information and preferences, including name, email address, age, address, mobile number and other contact details, demographic profile, and information about pages you visit and features you use. Processing of such information is governed by the Privacy Policy.",
      "By registering your mobile number with us, you consent to be contacted by us directly or through a third-party service provider via phone calls, SMS, in-app notifications and/or other electronic modes of communication.",
    ],
  },
  {
    id: "content",
    heading: "Content",
    paragraphs: [
      "\"Content\" includes (but is not limited to) reviews, images, photos, audio, video, location data, nearby places, and all other forms of information or data.",
      "\"Your Content\" or \"Customer Content\" means content that you upload, share or transmit in connection with the Services, such as likes, ratings, reviews, images, messages, profile information, or other materials displayed in your account.",
      "\"Our Content\" means content that VYBZ creates and makes available in connection with the Services, including visual interfaces, interactive features, graphics, design, compilation, software, aggregate ratings, reports and usage-related data, excluding Your Content and Third Party Content.",
      "\"Third Party Content\" means content from parties other than VYBZ or its customers, such as Merchants' content.",
    ],
    subsections: [
      {
        heading: "Ownership of Our Content and Proprietary Rights",
        paragraphs: [
          "We are the sole and exclusive copyright owners of the Services and Our Content. We also exclusively own the copyrights, trademarks, service marks, logos, trade names, trade dress and other intellectual and proprietary rights (\"IP Rights\") associated with the Services and Our Content. You acknowledge that the Services contain original works developed through substantial time, effort and money and constitute valuable intellectual property for us.",
          "You agree to protect VYBZ's proprietary rights and to comply with reasonable written requests made by us or our licensors. Nothing in these Terms gives you a right to use any of VYBZ's trade names, trademarks, logos, domain names or other brand features unless agreed otherwise in writing.",
          "You agree not to use framing techniques to enclose any trademark or logo of VYBZ, or remove, conceal or obliterate any copyright or proprietary notice. Infringement may lead to legal proceedings. You may not modify, reproduce, publicly display or exploit Our Content except as expressly authorised by VYBZ.",
          "To the fullest extent permitted by law, we neither warrant nor represent that your use of materials on the Services will not infringe rights of third parties. Notify us promptly if you become aware of any claim that the Services infringe any rights.",
        ],
      },
      {
        heading: "Your License to Use Our Content",
        paragraphs: [
          "We grant you a personal, limited, non-exclusive and non-transferable license to access Our Content and/or use the Services only as expressly permitted in these Terms. You shall not use the Content and/or Services for any illegal purpose or in any manner inconsistent with these Terms. Information made available through the Services is for your personal, non-commercial use only, except as otherwise expressly granted in writing.",
          "Violation of these license provisions may result in immediate termination of your right to use the Services, as well as potential liability for copyright and other IP Rights infringement.",
        ],
      },
      {
        heading: "VYBZ's License to Your Content",
        paragraphs: [
          "By submitting Your Content, you irrevocably grant VYBZ a perpetual, irrevocable, worldwide, non-exclusive, fully paid and royalty-free, assignable, sub-licensable and transferable license to use Your Content and all IP Rights therein for any purpose including API partnerships with third parties and in any media existing now or in future. \"Use\" includes copy, display, distribute, modify, translate, reformat, incorporate into advertisements and other works, analyse, promote, commercialise and create derivative works. You grant us the right to use the name or username you submit with Your Content, and you waive moral rights or attribution claims with respect to Your Content against VYBZ, Customers and third-party services.",
        ],
      },
      {
        heading: "Your Content",
        paragraphs: [
          "You are responsible for Your Content. You represent that you own or control the rights to Your Content or have explicit permission from the rights holder; that it was not copied from another work without rights; that it was not submitted via automated bots; that use of Your Content will not violate third-party rights; that it is truthful and accurate; and that it does not violate our content guidelines or applicable laws.",
          "If Your Content is a review, you represent that you are the sole author; the review reflects an actual experience; you were not paid to post it; and you had no undisclosed incentive to post an unfair review.",
          "You assume all risks associated with Your Content. While we reserve the right to remove Content, we do not control Customer Content and do not guarantee its accuracy. Liability for Customer Content rests with the Customer who posted it.",
          "Content removal: We may remove, block or disable access to any Content we consider objectionable, in violation of the Terms, or otherwise harmful, at our sole discretion. Subject to applicable law, we are not obligated to return Your Content. Merchants may also remove images from their listing pages at their discretion.",
          "By using our Services, you agree that for any Content you upload, you will accurately declare whether it is Synthetically Generated Information when prompted. Providing a false declaration is a material breach. \"Synthetically Generated Information\" means any audio Content artificially or algorithmically created, generated or altered so it could be perceived as a natural human voice or real-world sound.",
        ],
      },
      {
        heading: "Third Party Content and Links",
        paragraphs: [
          "Some content available through the Services may include or link to materials belonging to third parties, such as events or movies. Your use of third-party services is governed by those parties' terms and privacy policies. We may obtain business addresses, phone numbers and other contact information from third-party vendors who obtain data from public sources.",
          "We have no control over, and make no representation or endorsement regarding, the accuracy, relevancy, copyright compliance, legality, completeness, timeliness or quality of any goods, services, advertisements or other content appearing in or linked from the Services. We do not screen all third-party material before or after including it.",
          "Third-party content, including content posted by Customers or Merchant partners, does not reflect our views. We assume no responsibility or liability for Your Content or any third-party content, and are not liable for loss or damage from reliance on external sites or resources.",
        ],
      },
      {
        heading: "Content Guidelines",
        paragraphs: [
          "You represent that you have read, understood and agreed to our content guidelines and policies as may be communicated on the Platform from time to time.",
        ],
      },
    ],
  },
  {
    id: "restrictions",
    heading: "Restrictions on Use",
    paragraphs: [
      "Without limiting these Terms, you specifically agree not to post or transmit any Content or engage in any activity that, in our sole discretion:",
    ],
    points: [
      "Violates our content guidelines and policies;",
      "Is harmful, threatening, abusive, harassing, tortious, indecent, defamatory, discriminatory, vulgar, profane, obscene, libellous, hateful or otherwise objectionable, invasive of privacy, or relating to money laundering or illegal gambling;",
      "Constitutes an inauthentic or knowingly erroneous review;",
      "Violates any third-party right, including privacy, publicity, copyright, trademark, patent, trade secret or other IP rights;",
      "Accuses others of illegal activity, or describes physical confrontations;",
      "Is illegal, or violates any applicable law or regulation;",
      "Attempts to impersonate another person or entity;",
      "Disguises the origin of Your Content, including by submitting under a false name or disguising the IP address;",
      "Constitutes deceptive advertising or a conflict of interest;",
      "Is commercial spam, surveys, contests, pyramid schemes, or paid/removed reviews;",
      "Asserts or implies that Your Content is sponsored or endorsed by us;",
      "Falsely states or conceals your affiliation with another person or entity;",
      "Accesses or uses another customer's account without permission;",
      "Distributes viruses or other harmful code;",
      "Interferes with or destroys functionality of the Services;",
      "Hacks or accesses proprietary or confidential records without permission;",
      "Violates any contract or fiduciary relationship;",
      "Decompiles, reverse engineers or attempts to derive source code from the Services;",
      "Removes or circumvents security-related features;",
      "Scrapes, crawls or commercialises the Services or Our Content without authorisation;",
      "Collects personal information about other customers;",
      "Is posted by a bot;",
      "Harms minors in any way;",
      "Threatens the unity, integrity, defence, security or sovereignty of India, or friendly relations with foreign states, or public order;",
      "Is patently false and published with intent to mislead or harass for financial gain or to cause injury.",
    ],
    subsections: [
      {
        heading: "Synthetically Generated Information",
        paragraphs: [
          "You are strictly prohibited from using our Services to create, host or share any Synthetically Generated Information that: (a) violates applicable laws, including the Bharatiya Nyaya Sanhita, 2023, and the Protection of Children from Sexual Offences Act, 2012; (b) contains child sexual abuse material, non-consensual intimate imagery, or is obscene, pornographic or invasive of privacy; (c) results in creation of a false document or electronic record; or (d) falsely depicts a real person or event in a manner likely to deceive others.",
          "We may deploy technical measures to verify declarations and/or label Content verified as Synthetically Generated Information; immediately remove Content or suspend accounts for violations; and disclose identity details to a complainant who is a victim (or acting on behalf of a victim) of unlawful Synthetically Generated Information, as required by law.",
        ],
      },
    ],
  },
  {
    id: "feedback",
    heading: "Customer Feedback",
    paragraphs: [
      "If you share ideas, suggestions, changes or documents regarding VYBZ's existing business (\"Feedback\"), you agree that: (i) your Feedback does not contain confidential or proprietary information of third parties; (ii) VYBZ has no obligation of confidentiality and may use Feedback on an unrestricted basis; (iii) VYBZ may already have similar Feedback under consideration; and (iv) you grant us a binding, non-exclusive, royalty-free, perpetual, global license to use, modify, develop, publish, distribute and sublicense the Feedback, and you waive related claims against VYBZ and Customers.",
      "Please provide only specific Feedback on VYBZ's existing services or marketing strategies. We do not accept unsolicited ideas for new campaigns, promotions, technologies or service names. If you still submit such materials (\"Submissions\"), they automatically become the property of VYBZ without compensation; we may use or redistribute them for any purpose; there is no obligation to review them or keep them confidential.",
    ],
  },
  {
    id: "events",
    heading: "Event Terms",
    paragraphs: [
      "VYBZ facilitates the sale and purchase of event tickets between Merchants and Customers. By purchasing tickets for an Event you agree to the Event Terms.",
      "The complete Event Terms — including payment methods, cancellations, refund policy, ticket delivery, RNPL (Pay XX% and reserve), and Refund Guarantee Terms — are published on the Events policy page and form part of these Terms.",
    ],
    points: [
      "Tickets are generally non-cancellable, non-transferable and non-refundable unless the Merchant's event page says otherwise, or the Merchant cancels/postpones and authorises a refund.",
      "Convenience fees are non-refundable except for Events cancelled by the Merchant.",
      "Event-specific terms on the Event page prevail if they conflict with the general Event Terms.",
      "Open Policies → Events for the full Event Terms, RNPL Terms and Refund Guarantee Terms.",
    ],
  },
  {
    id: "movies",
    heading: "Movies",
    paragraphs: [
      "VYBZ facilitates the sale and purchase of movie tickets between Merchants (cinemas/theatres) and Customers through the Platform.",
      "The complete Movies booking terms — including entry rules, charges, cinema cancellation policy and food vouchers — are published on the Movies policy page and form part of these Terms.",
    ],
    points: [
      "Bookings once made cannot be cancelled, modified, exchanged or refunded unless such policies are provided at the cinema or Platform and opted-in by you while booking.",
      "Booking charges and/or internet handling charges are levied on all tickets booked online and are non-refundable.",
      "Before purchasing, check age restrictions. Individuals under 18 shall not enter for A-rated movies.",
      "If the merchant cancels or reschedules a show, VYBZ will notify you on a best-effort basis and refund according to the cinema/theatre's policy.",
      "Cinema cancellation refunds follow the partner policy communicated at booking. Partial cancellation is not allowed; promocode benefits are considered redeemed if tickets are cancelled.",
      "Open Policies → Movies for the full Movies booking terms and cinema cancellation table.",
    ],
  },
  {
    id: "activities",
    heading: "Activities",
    paragraphs: [
      "VYBZ facilitates booking of activities and experiences listed by Merchants on the Platform (\"Activities\"), including recreational experiences, workshops, outdoor sessions and similar offerings (excluding dining reservations, gift cards and retail stores, which are not offered on VYBZ).",
      "By booking an Activity, you agree that availability, pricing and fulfilment are controlled by the Merchant. VYBZ provides information and payment facilitation on a best-effort basis.",
      "Activity-specific terms on the Activity page prevail in case of conflict with these Terms.",
    ],
    subsections: [
      {
        heading: "Bookings and confirmation",
        points: [
          "Provide accurate booking details. By submitting a booking you accept these Terms and the Privacy Policy, and agree to receive confirmations by email, SMS and/or in-app notification.",
          "After payment you will receive a confirmation that must be shown at the venue or as directed by the Merchant.",
          "If confirmation is not received after payment, contact customer care to verify order status. VYBZ is not liable for losses due to banks or payment aggregators.",
        ],
      },
      {
        heading: "Fees, modifications and cancellations",
        points: [
          "VYBZ may charge a convenience or cover charge communicated at checkout. Convenience fees are generally non-refundable except where the Merchant cancels the Activity.",
          "Modification of a confirmed booking is subject to Merchant acceptance. Cancellation and refund windows follow the policy shown before payment and in our Cancellation & Refund Policy.",
          "If the Merchant fails to honour a confirmed booking, raise the dispute through Platform support promptly. VYBZ will make reasonable efforts to verify facts and may initiate a refund at its discretion in line with Merchant confirmation.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "VYBZ is not liable for in-person interactions with the Merchant, the quality of the Activity experience, injuries or mishaps at the Merchant's premises, or a Merchant's failure to honour additional requests. Personal information shared for fulfilment will be used as described in the Privacy Policy; VYBZ is not liable for a Merchant's subsequent use of that information.",
        ],
      },
    ],
  },
  {
    id: "play",
    heading: "Play",
    paragraphs: [
      "VYBZ facilitates booking of time-bound slots at Facilities (sports venues, courts, grounds, gyms and similar premises) for Activities offered by Merchants. By booking a slot you agree to the Play Facility Terms.",
      "The complete Play booking terms — including payment methods, pricing and confirmation rules, the cancellation refund table, and additional liability terms — are published on the Play policy page and form part of these Terms.",
    ],
    points: [
      "Customer cancellations: more than 24 hours before slot start — 100% refund of base booking price; 12 to 24 hours — 50% refund; 0 to 12 hours or no-show — no refund. Convenience fee is not refunded.",
      "Merchant/Facility cancellations due to operational reasons, weather, technical failures or overbooking: 100% refund, or reschedule when available.",
      "Facility-specific terms on the venue page prevail if they conflict with the general Facility Terms.",
      "Open Policies → Play for the full numbered Facility Terms, payment tables and cancellation table.",
    ],
  },
  {
    id: "general",
    heading: "General Terms and Conditions",
    paragraphs: [
      "You are solely responsible for providing correct details and making payments for bookings through your account. VYBZ has no liability for incorrect details you provide.",
      "VYBZ may charge subscription, membership, convenience/platform or other fees communicated at checkout. By completing a transaction you agree to pay such charges. Credits, discounts, promo codes or vouchers may be offered and may be modified or discontinued by VYBZ or the Merchant.",
      "Provide authentic information. If information is found false or inaccurate, VYBZ may reject registration, cancel orders and debar you from Services without prior notice or liability.",
      "VYBZ may suspend, cancel or discontinue Services, or modify contents and offerings, without prior notice as the Platform evolves.",
      "Software updates may be pushed automatically. You may need to install updates to continue using the Services.",
      "If access to your account is disabled, you may be prevented from accessing Services, account details or content in the account.",
      "VYBZ may set upper limits on transmissions through the Services and will communicate them on the Platform.",
      "We may run experiments so some Customers experience features differently. Referral or incentive programmes are governed by their own terms; abuse may lead to suspension.",
      "Third-party add-on services opted via the Platform are provided solely by those third parties under their terms; VYBZ has no control over fulfilment. Opting in consents to sharing relevant personal and transaction details with that provider.",
    ],
  },
  {
    id: "ip",
    heading: "Intellectual Property",
    paragraphs: [
      "VYBZ expressly reserves all intellectual property rights in text, programs, services, processes, technology, images, content and other materials on the Platform. Access does not confer any license to IP rights. Copying or storing Platform contents in whole or part without prior written consent is prohibited.",
      "Names, logos and related marks are trademarks/service marks of VYBZ, its affiliates, partners or suppliers. No trademark license is granted by access. Third-party references or links are for convenience and do not imply endorsement.",
      "If you believe your IP rights have been infringed, inform us at the contact details below. Reporting false information may result in civil and/or criminal liability. You agree to indemnify VYBZ for claims arising from such submissions.",
    ],
  },
  {
    id: "information-disclosure",
    heading: "Information Disclosure",
    paragraphs: [
      "VYBZ maintains physical, electronic and managerial procedures to protect information under its control. Servers are accessible only to authorised personnel on a need-to-know basis. Internet transmissions cannot be fully secure; by using the Platform you agree VYBZ has no liability for disclosure due to transmission errors or unauthorised acts of third parties.",
      "Call recording: Calls between you and us (directly or through a third party) may be recorded for training and quality. You permit recording and sharing with authorised personnel, and sharing with group companies/affiliates or authorities if required by law.",
    ],
  },
  {
    id: "misrepresentation",
    heading: "Misrepresentation",
    paragraphs: [
      "VYBZ assumes no responsibility for communication not authorised by VYBZ regarding offers, promotions or sales. We do not solicit confidential information such as OTP, CVV, PIN or card number by call, mail or other means. If you receive such a request, do not respond. Report suspicious activity to hello@vybz.app.",
    ],
  },
  {
    id: "disclaimer",
    heading: "Disclaimer of Warranties, Limitation of Liability and Indemnity",
    subsections: [
      {
        heading: "Disclaimers",
        paragraphs: [
          "You access the Services and transact at your own risk using your best judgment. Depictions of services (colour, size, appearance) are representative and may vary on your display.",
          "VYBZ does not make warranties regarding services on the Platform and does not endorse Merchant supply. VYBZ accepts no liability for errors or omissions of third parties or information received from third parties.",
        ],
      },
      {
        heading: "Indemnity",
        paragraphs: [
          "You agree to indemnify, defend and hold harmless VYBZ from third-party claims, damages, actions, losses, liabilities, costs and expenses (including reasonable legal fees) arising from: (a) your Feedback and/or Content; (b) unauthorised use of the Platform/Services; (c) your access to and use of the Services; (d) violation of third-party rights; or (e) breach of these Terms (including Privacy Policy) and/or applicable law. We may assume exclusive defence of matters for which you must indemnify us; you agree to cooperate and not settle such matters without our prior written consent.",
        ],
      },
      {
        heading: "Limitation of Liability",
        points: [
          "VYBZ shall not be liable for claims, damages or losses other than as established by a non-appealable order of a court of competent jurisdiction.",
          "Subject to the above, maximum aggregate liability of VYBZ shall not exceed ₹5,000 (Indian Rupees Five Thousand Only) for any claim under these Terms.",
          "VYBZ shall not be liable for indirect, special, consequential, exemplary, punitive or incidental losses, including loss of profit, reputation or business opportunities.",
        ],
      },
    ],
  },
  {
    id: "termination",
    heading: "Termination of Your Access to the Platform/Services",
    paragraphs: [
      "VYBZ may, without liability, terminate or refuse registration, terminate use of the Platform/Services, or restrict access, without notice, if you do not meet eligibility criteria or may breach these Terms (including Privacy Policy). We may deactivate or delete your account and related information. If you violate these Terms, we may retain data collected from your use. We are not liable to you or third parties for discontinuation of access.",
      "You may delete your account using the option on the Platform and cease use. Personal data is processed per the Privacy Policy.",
      "Rights to Feedback, indemnification, and Governing Law survive termination. Termination does not waive payment obligations for services already ordered or liability arising before termination.",
    ],
  },
  {
    id: "governing-law",
    heading: "Governing Law & Jurisdiction",
    paragraphs: [
      "These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict-of-laws principles. Courts at Hyderabad, Telangana shall have exclusive jurisdiction over proceedings arising in respect of these Terms (including Privacy Policy).",
    ],
  },
  {
    id: "miscellaneous",
    heading: "Miscellaneous",
    points: [
      "Interpretation: Section headings are for reference only and shall not affect interpretation.",
      "Entire Agreement and Waiver: These Terms together with the Privacy Policy constitute the entire agreement concerning the Services. Failure to enforce a right is not a waiver.",
      "Severability: If any provision is unlawful or unenforceable, it is severed and the remainder continues in effect.",
      "Partnership or Agency: Nothing in these Terms creates a partnership or agency; you have no authority to bind VYBZ.",
      "Carrier Rates: Accessing Services via mobile may incur carrier charges for which you are solely responsible.",
      "Linking and Framing: You may not frame the Services. You may link to the Services only if the linking site does not contain inappropriate or unlawful material; violation may result in immediate termination of access.",
    ],
  },
  {
    id: "contact",
    heading: "Contact Us",
    paragraphs: [
      "Brand: VYBZ",
      "Address: Raidurg Metro Pillar, HITEC City, Hyderabad, Telangana 500081",
      "Contact: hello@vybz.app · +91 40 4567 8900",
      "For order-related issues, first use in-Platform support where available. For grievances, write to hello@vybz.app with your booking ID and details. We aim to respond within the timelines required under applicable consumer protection laws.",
    ],
  },
];
