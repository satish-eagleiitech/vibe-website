import { Suspense } from "react";
import { BookingsView } from "@/components/bookings/BookingsView";

export const metadata = {
  title: "My bookings",
};

export default function TicketsPage() {
  return (
    <Suspense fallback={null}>
      <BookingsView />
    </Suspense>
  );
}
