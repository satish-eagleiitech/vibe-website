import { redirect } from "next/navigation";

export const metadata = {
  title: "History",
};

/** Past adventures live under My bookings. */
export default function HistoryPage() {
  redirect("/tickets");
}
