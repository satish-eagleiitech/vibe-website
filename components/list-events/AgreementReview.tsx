"use client";

const ANNEXURE: { no: string; area: string; point: string }[] = [
  { no: "2.1", area: "Communication", point: "Production of the event layout" },
  { no: "2.2", area: "Communication", point: "Production of the run-of-show" },
  { no: "2.3", area: "Communication", point: "Production of the run-of-show PDF" },
  { no: "2.4", area: "Communication", point: "Production of the emergency plan" },
  { no: "2.5", area: "Communication", point: "Production of the guest parking plan" },
  { no: "2.5.1", area: "Communication", point: "Venue available / hold-the-date communicated locally" },
  { no: "2.6", area: "Communication", point: "Artist availability confirmed" },
  { no: "2.7", area: "Communication", point: "Advance-sale / hold tickets communicated" },
  { no: "2.7.2", area: "Communication", point: "Food availability" },
  { no: "2.7.3", area: "Communication", point: "Bar availability" },
  { no: "2.7.4", area: "Communication", point: "Bus availability" },
  { no: "3.0", area: "Frontage / Curbside", point: "Large parking facility" },
  { no: "3.1", area: "Frontage / Curbside", point: "Drop-off, parking and ticketing gate" },
  { no: "3.2", area: "Frontage / Curbside", point: "Deployment of security staff at venue" },
  { no: "3.3", area: "Frontage / Curbside", point: "Display of accreditation of crew, guests and artists" },
  { no: "3.4", area: "Security", point: "Clear access at gate / venue" },
  { no: "4.0", area: "Entry", point: "Holding area for guests" },
  { no: "4.5", area: "Entry", point: "Separate entrance and exit for artists" },
  { no: "5.0", area: "Entry", point: "Separate all-access lanes" },
  { no: "5.5", area: "Viewing experience", point: "Agreement of camera / live stream" },
  { no: "6.0", area: "Viewing experience", point: "Stage, sound and lighting plan" },
  { no: "6.1", area: "Viewing experience", point: "Seating plan and crowd flow" },
  { no: "7.0", area: "F&B experience", point: "Hygiene and waste plan" },
  { no: "7.1", area: "F&B experience", point: "Menu and hygiene standards" },
  { no: "7.2", area: "F&B experience", point: "Access to drinking water" },
  { no: "7.8", area: "F&B experience", point: "Money handling and cashless payments" },
  { no: "8.0", area: "Artist", point: "Artist liaison and rider" },
  { no: "8.1", area: "Washrooms", point: "Adequate washroom capacity" },
  { no: "8.2", area: "Washrooms", point: "Accessible / gender-neutral washrooms" },
  { no: "8.3", area: "Washrooms", point: "Housekeeping throughout the event" },
  { no: "9.0", area: "Seating", point: "Adequate reserved and general seating" },
  { no: "9.1", area: "Seating", point: "Aisle and emergency exit kept clear" },
  { no: "9.2", area: "Seating", point: "Individual / standalone seating where required" },
  { no: "9.3", area: "Emergency", point: "First-aid point on site" },
  { no: "9.4", area: "Emergency", point: "Evacuation route published" },
  { no: "9.5", area: "Emergency", point: "Security contact available" },
  { no: "10.0", area: "Online support", point: "Box office / live venue contact created" },
  { no: "10.1", area: "Online support", point: "Work-box availability" },
];

type AgreementReviewProps = {
  organiserName: string;
  email: string;
  signature: string;
  onCreateSignature: () => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function AgreementReview({
  organiserName,
  email,
  signature,
  onCreateSignature,
  onSubmit,
  onClose,
}: AgreementReviewProps) {
  const name = organiserName || "the Event Organiser";

  return (
    <div className="fixed inset-0 z-[70] flex justify-center bg-black/40 sm:p-6">
      <div className="flex h-full w-full max-w-3xl flex-col bg-bg sm:h-[min(920px,100%)] sm:rounded-[28px] sm:border sm:border-border">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-[15px] font-extrabold text-text">VYBE</p>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">
              Creator platform
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-[13px] font-bold text-text-secondary">
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6 text-[13px] leading-[1.7] text-text-secondary sm:px-8">
          <h2 className="text-[18px] font-extrabold tracking-[0.04em] text-text uppercase">
            Ticketing services agreement
          </h2>
          <p className="font-semibold text-text">
            PLEASE READ THIS AGREEMENT CAREFULLY. THIS AGREEMENT CONTAINS INFORMATION REGARDING YOUR LEGAL RIGHTS, REMEDIES AND OBLIGATIONS AND CONSTITUTES A BINDING LEGAL AGREEMENT BETWEEN YOU AND VYBE. BY CLICKING “ACCEPT”, YOU AGREE TO BE BOUND BY THE TERMS OF THIS AGREEMENT.
          </p>
          <p>
            For any questions regarding this Agreement, write to{" "}
            <span className="font-semibold text-accent">creators@vybe.app</span>.
          </p>
          <p>
            “You”, “Your”, “Company” or “Event Organiser” means {name}. “VYBE”, “We”, “Us” or “Our” means VYBE Private Limited. “Parties” means You and VYBE collectively, and “Party” means either of them.
          </p>
          <p>
            You hereby agree to the terms of this Agreement by clicking on the “ACCEPT” button. If you are accepting this Agreement on behalf of another person, then You hereby represent and warrant that You have the requisite power and authorization to bind the other person to the terms of this Agreement, and that You shall be fully responsible and liable for all the other person’s obligations and breaches under this Agreement.
          </p>
          <p>
            Any acknowledgment by VYBE is only confirmation of receipt of submission of Your Event, notwithstanding anything that may be stated in the confirmation communication that reaches You pursuant to You clicking on the ACCEPT button or the fact that Your event is showing live immediately upon You clicking on the ACCEPT button.
          </p>
          <p>
            WHEN YOU PUBLISH AN EVENT YOU WILL BE ASKED TO ENROL / REGISTER BY FOLLOWING A GUIDED PROCESS AND A LOGIN ID AND PASSWORD SHALL BE ISSUED TO YOU. THE LOGIN ID AND PASSWORD ARE THE MEANS THROUGH WHICH YOU ACCESS CERTAIN SERVICES OF VYBE. YOU ACKNOWLEDGE AND AGREE THAT IT IS YOUR RESPONSIBILITY TO SAFEGUARD THE LOGIN ID AND PASSWORD FROM UNAUTHORIZED USE OR APPLICATION AND TO ENSURE THAT THE SAME IS NOT REVEALED TO ANY THIRD PARTY. YOU WILL IMMEDIATELY NOTIFY US IF YOUR LOGIN ID AND/OR PASSWORD IS LOST OR BECOMES KNOWN TO ANOTHER PERSON AND YOU ARE SOLELY RESPONSIBLE FOR ALL ACCESS TO AND USE OF THIS SITE AND YOU SHALL NOT LET ANY OTHER PERSON USE YOUR LOGIN ID AND/OR PASSWORD. PLEASE REACH OUT TO creators@vybe.app FOR ANY ASSISTANCE THAT YOU MAY NEED.
          </p>
          <p>
            This Agreement shall be read together with the Ticketing Services Terms and Conditions (“Terms”) which are available on the VYBE app. All capitalized words, not defined under the Agreement, shall find their meaning under the Terms.
          </p>
          <p>
            You will ensure that all on-ground operational and logistical compliances are carried out in accordance with the executed Pre-Event Checklist detailed in Annexure - A, and further warrant that should there be any shortcomings, then the same will be duly replaced, substituted or complemented by additional facilities so as to maintain Pre-Event Checklist’s compliances true and correct throughout the duration of the Event.
          </p>
          <p>
            I/We hereby acknowledge and agree that by signing this Agreement, I/We are entering into a valid and binding agreement with VYBE Private Limited (“VYBE”), and that this Agreement together with the Terms collectively constitute the entire Agreement and constitute a legally binding contract between us and VYBE. I/We confirm that I/We have read, understood, and accepted the Agreement in its entirety and agree to comply fully with all obligations therein. I/We further represent and warrant that I/We have full authority to enter into and bind the Company to this Agreement.
          </p>

          <h3 className="text-[15px] font-extrabold text-text">1. SERVICES PROVIDED BY VYBE</h3>
          <p>VYBE shall undertake the following services for the purposes of the Event:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>To facilitate listing of the Event/Activity, related to the Event(s) on the VYBE Platform;</li>
            <li>If mutually agreed between the Parties in writing (emails permitted), and subject to such mutually agreed terms, to manage and arrange the sale of Ticket(s) or both at the Event(s) venue;</li>
            <li>To act as inventory management partner using VYBE’s Inventory Management System for distribution of movement of Tickets of the Event(s) in real time;</li>
            <li>To maintain a record of capturing movement of Tickets including the serial number/transaction number, number of Tickets, name of the Customer and such other details, denomination/category of Tickets in respect of the Event(s);</li>
            <li>Subject to availability of the Event(s), ensure continuously reasonable availability of Event Ticket(s) for Remote Sale;</li>
            <li>To provide promotional and marketing services for promoting the Event(s) on the VYBE Platform. For accessing promotional and marketing services, please reach out to creators@vybe.app;</li>
            <li>To make the VYBE Platform accessible through computers and mobile applications for Remote Sale of the Ticket(s);</li>
            <li>To generate reports through Inventory Management System. Such reports shall be made available through the Creator Hub and shall be accessible after the Event goes live;</li>
            <li>To be responsible for hosting the Order Processing System, a data centre with high speed connectivity, network security, and shall use reasonable efforts to ensure that the Order Processing System may be accessible to Customer(s) via the VYBE Platform 24×7 except for scheduled maintenance. The foregoing high downtime may occasionally be required. VYBE shall use all reasonable efforts to ensure that scheduled maintenance is kept to professional standards. VYBE’s role is limited to managing the VYBE Platform whereas booking for sale of Ticket(s) is solely the Event Organiser’s responsibility. You and/or the Customer. Accordingly, VYBE is merely an intermediary and VYBE is not responsible for the Customer’s booking experience. Except as provided herein, to the maximum extent permitted by Applicable Law, the VYBE Platform is provided on an “as is” and “as available” basis;</li>
            <li>To submit a complete statement of account of the total number of Ticket(s) sold, unsold and details of the amount received by You, which shall be available on the Creator Hub;</li>
            <li>VYBE shall have a limited right to use Your IP and Event’s IP, and all marketing materials for the Event engaged for the Event(s) only for performance of VYBE’s Services;</li>
            <li>Your queries regarding the Event(s) can be addressed by visiting the help section of the VYBE Platform. If the foregoing Help Section does not help You with Your query, then You may reach out to creators@vybe.app;</li>
            <li>To collect on Your behalf, the ticket revenues generated from the sale of Tickets on the VYBE Platform through Corporate Sales/Bulk Booking. For Corporate Sales/Bulk Booking, You may reach out to creators@vybe.app;</li>
            <li>You agree and acknowledge that VYBE shall not be liable for any loss, damage, claim, or expense, nor any damage that may be incurred pursuant to publication/uploading of the content (including comments, reviews, etc.) by You or any third party on the VYBE Platform or on VYBE or its Affiliates’ social media channels. VYBE agrees and acknowledges that Your Content may be removed by VYBE from Your Event listing at any time;</li>
            <li>You agree and acknowledge that VYBE shall have the right to remove all of Your Content available on VYBE or its Affiliates’ social media channels, including but not limited to the Event, Event IP or description of the Event, at its own discretion, in case such content is in violation of Applicable Laws. However, the record of such content may be retained by VYBE for one hundred and eighty (180) days from removal unless otherwise required by Applicable Laws.</li>
          </ol>

          <h3 className="text-[15px] font-extrabold text-text">2. EVENT CANCELLATION</h3>
          <ol className="list-decimal space-y-2 pl-5">
            <li>An Event can be cancelled without terminating the whole Agreement by emailing creators@vybe.app at least 48 hours before the intended removal from the VYBE Platform.</li>
            <li>Bookings are generally non-cancellable and non-refundable. Tickets are refunded for cancelled Events. You must notify VYBE immediately of a cancellation. VYBE will communicate refund amounts to be paid to the Customer. You must communicate with VYBE within 7–10 days of the refund notice. VYBE will levy and recover Cancellation Charges from Net Revenues. If funds were already transferred to You, it is Your responsibility to refund the Customer, with the option to do so through VYBE upon receipt of funds from You.</li>
            <li>If VYBE cannot deduct Cancellation Charges from Net Revenues, You must pay them within seven (7) days. These charges apply to all cancellations except those caused by technical glitches on the VYBE Platform. Liability for taxes on refunds stays with You.</li>
            <li>Any rescheduling or change to the date/schedule is treated as a cancellation on the VYBE Platform. Refund terms for these instances are decided by You and must be published on the platform.</li>
            <li>You shall indemnify and hold harmless VYBE against any and all claims arising out of refund or non-refunding of the Ticket amount due to cancellation or rescheduling of the Event, subject to claims arising because of VYBE’s inability to refund Customers owing to insufficiency of the Event’s Tickets’ gross revenues available with VYBE.</li>
            <li>For multi-day Events with single-day passes, cancellation of a single day may result in pro-rated refunds and Cancellation Charges on such pro-rated amounts, subject to the Event’s cancellation policy and chargebacks.</li>
            <li>In case of cancellation or rescheduling of any Tickets to a later date, VYBE shall refund the entire amount of gross value of the Tickets to all the Customers, and cancellation charges shall be deductible on such refunds and deducted as part of VYBE’s Deductibles from the Net Revenue payable to the Event Organizer in the next payment cycle. Tickets for the rescheduled date shall be treated as a new Event.</li>
            <li>All billable commercials mentioned herein include all liabilities exclusive of all applicable taxes including the Goods & Services Tax. All percentage values are to be applied on the gross values.</li>
          </ol>

          <h3 className="text-[15px] font-extrabold text-text">3. COMMERCIAL TERMS</h3>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              In consideration for the Services, VYBE will charge a Commission of 10% of the total gross revenue on the Ticket(s); and Commission of 10% of the total gross revenue on the Ticket(s) in case Your Event is scheduled on a date which falls during the festive period including Navratri/Holi/Christmas/New Years etc.
              <p className="mt-2">
                Complimentary Tickets may be issued up to a maximum of 5% of actual sold inventory. Cancellation charges shall be 5%. The person signing represents the legal entity {name} and has the authority to bind the Event Organiser to this agreement.
              </p>
            </li>
            <li>Revised commissions for festive periods will be communicated by VYBE in writing. VYBE may provide back-office management services (listing, booking, redemption, etc.). Contact creators@vybe.app for details.</li>
            <li>
              Post-event, You may access data through Your Creator Hub. Net Revenue is paid after deducting VYBE’s Deductibles. VYBE’s payment cycle closes every Friday, with payments typically released the following Friday. “Net Revenue” means gross amounts received by VYBE from ticket sales during the Term, minus VYBE’s deductibles. Convenience Fee is not calculated as part of gross revenues.
            </li>
          </ol>

          <h3 className="text-[15px] font-extrabold text-text">4. COMMERCIALS & TAXES</h3>
          <p>
            All commercials are exclusive of applicable taxes, including GST. Payments are to be made against invoices subject to withholding taxes (TDS) as per Applicable Law. If deductibles are less than the net revenue payable to You, You are liable to pay the amount due within three (03) days of receipt of VYBE’s invoice.
          </p>

          <h3 className="text-[15px] font-extrabold text-text">5. DISCOUNT CODES</h3>
          <p>
            You can choose to apply discount codes available in the Creator Hub. Final amounts will reflect deductions based on the discount applied.
          </p>

          <h3 className="text-[15px] font-extrabold text-text">6. NO-SHOW POLICY</h3>
          <p>
            In the event of a “no show” where a Customer paid a Cover Charge that charge shall be distributed as mutually agreed between the Event Organiser and VYBE.
          </p>

          <h3 className="text-[15px] font-extrabold text-text">7. PAYMENTS</h3>
          <p>
            VYBE transfers Net Revenue after post-Event reconciliation. Payments are typically released the Friday following the week reconciliation is completed. “Net Revenue” is defined as gross revenues received by VYBE from ticket sales during the Term, minus VYBE’s deductibles. The Convenience Fee is not calculated as part of gross revenues.
          </p>

          <h3 className="text-[15px] font-extrabold text-text">8. CORPORATE & BULK SALES</h3>
          <p>
            VYBE charges a commission on tickets sold in bulk for corporate sales. For corporate sales, the Event Organiser makes an invoice directly to the buyer, but the tickets must still be entered into the Creator Hub for processing and redemption.
          </p>

          <h3 className="text-[15px] font-extrabold text-text">9. OPTIONAL TICKET RESERVATION FACILITY (IF OPTED BY YOU)</h3>
          <ol className="list-[lower-alpha] space-y-2 pl-5">
            <li>If opted, You permit VYBE to enable an OTR (Optional Ticket Reservation) Facility to facilitate deferred payment by Customers.</li>
            <li>“OTR Facility” allows Customers an option to pay fifty percent (50%) of the actual face value of the ticket (“Partial Ticket Value”) as a reservation amount and pay the balance anytime before T-1 days before Event’s Scheduled Date.</li>
            <li>Along with the Partial Ticket Value, You will charge Customers (i) only fifty percent (50%) of other applicable charges including Convenience Fee and Delivery Charges (if any) (“Other Charges”), and the balance remaining fifty percent (50%) of the Other Charges once the full Ticket value is paid; and (ii) applicable GST.</li>
            <li>Until Customer acquires the confirmed Ticket by paying the remaining Balance Amount anytime before T-1 day, Customer does not have a right to attend the Event, nor any claim to a confirmed Ticket or a scannable QR code for redemption at the Venue.</li>
            <li>If Customer fails to pay the Balance Amount then the Partial Ticket Value paid by such Customer along with applicable GST (“Forfeited Value”) shall be forfeited by VYBE on Your behalf, as part of Net Revenues, and transferable to Event Organizer in the next payment cycle. VYBE shall not be responsible for issuing separate invoices to such Customers for Forfeited Value.</li>
            <li>VYBE shall charge You (i) fifty percent (50%) of the Partial Ticket Value PLUS (ii) fifty percent (50%) of all GST applicable on service charges, as part of VYBE’s Deductibles. Other charges paid partially by Customer are non-refundable and retained by VYBE.</li>
            <li>For all Purposes of the Agreement, the Forfeited Value shall be treated as Net Revenue in accordance with this Agreement.</li>
            <li>You shall intimate VYBE on the event of “N” to determine the cut-off at T-N days. VYBE shall implement such time limitation on the VYBE Platform.</li>
            <li>OTR Facility shall be applicable and available only for sale of Tickets remotely through the VYBE Platform.</li>
            <li>No additional charges shall be levied by VYBE for enabling OTR Facility for the Event; and no Commission shall be chargeable on the Forfeited Value. Commission shall be chargeable only when a Customer pays the Balance Amount and obtains a fully redeemed ticket.</li>
            <li>Parties shall mutually agree on the percentage of saleable capacity that may be offered subject to enabled OTR Facility and the duration for which OTR Facility shall be enabled (“OTR Window”). VYBE reserves the right, in consultation with You, to alter such quantum or duration subject to prior meaningful consultation.</li>
          </ol>

          <h3 className="pt-2 text-[16px] font-extrabold text-text">Annexure – A</h3>
          <p className="font-extrabold tracking-wide text-text uppercase">Pre-event checklist</p>
          <p>
            Items for which the Facility shall be made available by You. VYBE may alter such quantum or duration subject to prior meaningful consultation.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[640px] text-left text-[12px]">
              <thead className="bg-surface-muted text-text">
                <tr>
                  <th className="px-3 py-2 font-extrabold">S.No</th>
                  <th className="px-3 py-2 font-extrabold">Particular</th>
                  <th className="px-3 py-2 font-extrabold">Check points</th>
                  <th className="px-3 py-2 font-extrabold">Yes / Remark</th>
                </tr>
              </thead>
              <tbody>
                {ANNEXURE.map((row) => (
                  <tr key={row.no} className="border-t border-border">
                    <td className="px-3 py-2 font-semibold text-text">{row.no}</td>
                    <td className="px-3 py-2">{row.area}</td>
                    <td className="px-3 py-2">{row.point}</td>
                    <td className="px-3 py-2">
                      <input
                        name={`annexure-${row.no}`}
                        defaultValue="Yes"
                        aria-label={`${row.point} remark`}
                        className="h-8 w-full min-w-[88px] rounded-lg border border-border bg-bg px-2 text-[12px] font-semibold text-text outline-none focus:border-text"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            You hereby agree and acknowledge to comply with the benchmark mentioned in this checklist in relation to the Event.
          </p>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-extrabold text-text">
              Executed on behalf of the Event Organiser by its Authorized Signatory:
            </p>
            <p className="mt-2">Signatory email: {email || "—"}</p>
            <p>A click on Create Signature is acceptance of this checklist.</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span>Signed with IP — recorded on submit</span>
              {signature ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={signature} alt="Signature" className="h-14 w-36 object-contain" />
              ) : (
                <button type="button" onClick={onCreateSignature} className="font-extrabold text-emerald-600">
                  Create your signature
                </button>
              )}
            </div>
          </div>
          <p className="text-[12px]">
            VYBE PRIVATE LIMITED. Registered office for operations in India. Contact: creators@vybe.app. Platform: VYBE.
          </p>
        </div>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={signature ? onSubmit : onCreateSignature}
            className="flex h-12 w-full items-center justify-center rounded-full bg-emerald-600 text-[15px] font-extrabold text-white"
          >
            Create Signature
          </button>
        </div>
      </div>
    </div>
  );
}
