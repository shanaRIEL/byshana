import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserBookings } from "@/lib/db";
import BookingCard from "@/components/booking/BookingCard";
import BookingTabs from "@/components/booking/BookingTabs";
import CancelBookingButton from "@/components/booking/CancelBookingButton";
import LeaveReviewButton from "@/components/booking/LeaveReviewButton";
import Footer from "@/components/footer/Footer";
import { browseFooterColumns } from "@/data";
import type { BookingData } from "@/components/booking/BookingCard";

export default async function RentBookingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const bookings = await getUserBookings(user.id);
  const typed = bookings as unknown as BookingData[];

  const upcoming = typed.filter((b) => ["pending", "accepted"].includes(b.status));
  const active = typed.filter((b) => b.status === "active");
  const completed = typed.filter((b) => b.status === "completed");
  const cancelled = typed.filter((b) => ["cancelled", "rejected"].includes(b.status));

  const tabs = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "active", label: "Active", count: active.length },
    { key: "completed", label: "Completed", count: completed.length },
    { key: "cancelled", label: "Cancelled", count: cancelled.length },
  ];

  function renderList(items: BookingData[], showReviewButton = false) {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-b7 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-b5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <p className="text-[0.88rem] text-b3 font-montserrat mb-1">No bookings here</p>
          <p className="text-[0.78rem] text-b5 font-montserrat">
            <Link href="/browse" className="underline hover:text-b3">Browse listings</Link> to find something you love.
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        {items.map((booking) => (
          <BookingCard key={booking.id} booking={booking} role="renter">
            {booking.status === "pending" && (
              <CancelBookingButton bookingId={booking.id} />
            )}
            {showReviewButton && booking.status === "completed" && (
              <LeaveReviewButton bookingId={booking.id} listingId={booking.listingId} />
            )}
          </BookingCard>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-b8">
      <div className="px-12 max-[900px]:px-6 py-10">
        <h1 className="font-playfair text-[2rem] text-b1 mb-2">My Bookings</h1>
        <p className="text-[0.84rem] text-b4 font-montserrat mb-8">
          Track your rental bookings and history.
        </p>

        <BookingTabs
          tabs={tabs}
          content={{
            upcoming: renderList(upcoming),
            active: renderList(active),
            completed: renderList(completed, true),
            cancelled: renderList(cancelled),
          }}
        />
      </div>

      <div className="mt-16">
        <Footer columns={browseFooterColumns} />
      </div>
    </div>
  );
}
