import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOwnerBookings } from "@/lib/db";
import BookingCard from "@/components/booking/BookingCard";
import BookingTabs from "@/components/booking/BookingTabs";
import OwnerBookingActions from "@/components/booking/OwnerBookingActions";
import type { BookingData } from "@/components/booking/BookingCard";

export default async function DashboardBookingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const bookings = await getOwnerBookings(user.id);
  const typed = bookings as unknown as BookingData[];

  const pending = typed.filter((b) => b.status === "pending");
  const active = typed.filter((b) => ["accepted", "active"].includes(b.status));
  const completed = typed.filter((b) => b.status === "completed");
  const rejected = typed.filter((b) => ["rejected", "cancelled"].includes(b.status));

  const tabs = [
    { key: "pending", label: "Pending", count: pending.length },
    { key: "active", label: "Active", count: active.length },
    { key: "completed", label: "Completed", count: completed.length },
    { key: "rejected", label: "Rejected", count: rejected.length },
  ];

  function renderList(items: BookingData[]) {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-b7 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-b5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <p className="text-[0.88rem] text-b3 font-montserrat">No bookings here</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        {items.map((booking) => (
          <BookingCard key={booking.id} booking={booking} role="owner">
            <OwnerBookingActions bookingId={booking.id} status={booking.status} />
          </BookingCard>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-playfair text-[1.8rem] text-b1 font-normal mb-2">
        Booking Requests
      </h1>
      <p className="text-[0.88rem] text-b4 font-light mb-8">
        Manage bookings on your listed items.
      </p>

      <BookingTabs tabs={tabs}>
        {(activeTab) => {
          if (activeTab === "pending") return renderList(pending);
          if (activeTab === "active") return renderList(active);
          if (activeTab === "completed") return renderList(completed);
          return renderList(rejected);
        }}
      </BookingTabs>
    </div>
  );
}
