"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import BookingStatusBadge from "@/components/booking/BookingStatusBadge";

interface BookingOwner {
  id: string;
  name: string | null;
  image?: string | null;
}

interface BookingListing {
  id: string;
  title: string;
  rentalPricePerDay: number;
  deposit: number;
  location: string;
  owner: BookingOwner;
  images?: { id: string; url: string; order: number }[];
}

export interface BookingData {
  id: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  rentalCost: number;
  deposit: number;
  total: number;
  status: string;
  listingId: string;
  renterId: string;
  createdAt: string;
  listing: BookingListing;
  renter: BookingOwner;
}

interface BookingCardProps {
  booking: BookingData;
  role: "renter" | "owner";
  children?: React.ReactNode;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BookingCard({ booking, role, children }: BookingCardProps) {
  const imageUrl = booking.listing.images?.[0]?.url ?? null;

  return (
    <div className="bg-b8 border border-b6 rounded-[16px] overflow-hidden">
      <div className="flex gap-4 p-4 max-[600px]:flex-col">
        <Link
          href={`/item/${booking.listingId}`}
          className="shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-b7 relative"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={booking.listing.title}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-b5 font-playfair text-xl">
              {booking.listing.title.charAt(0)}
            </div>
          )}
        </Link>

        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/item/${booking.listingId}`}
              className="font-montserrat font-semibold text-[0.88rem] text-b1 hover:text-b3 transition-colors truncate"
            >
              {booking.listing.title}
            </Link>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="flex items-center gap-2 text-[0.75rem] text-b4 font-montserrat">
            <span>{role === "renter" ? `Listed by ${booking.listing.owner.name ?? "Anonymous"}` : `Booked by ${booking.renter.name ?? "Anonymous"}`}</span>
            <span className="w-1 h-1 rounded-full bg-b5" />
            <span>{booking.listing.location}</span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.78rem] font-montserrat text-b3">
            <span>
              <span className="text-b5">From:</span> {formatDate(booking.startDate)}
            </span>
            <span>
              <span className="text-b5">To:</span> {formatDate(booking.endDate)}
            </span>
            <span>
              <span className="text-b5">Duration:</span> {booking.totalDays} day{booking.totalDays !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-b6/50">
            <div className="flex items-baseline gap-2">
              <span className="font-playfair text-[1.05rem] text-b1 font-semibold">
                {formatPrice(booking.total)}
              </span>
              <span className="text-[0.68rem] text-b5 font-montserrat">total</span>
            </div>
            <span className="text-[0.68rem] text-b4 font-montserrat">
              {formatPrice(booking.dailyRate)}/day
            </span>
          </div>
        </div>
      </div>

      {children && (
        <div className="px-4 pb-4 pt-2 border-t border-b6/50 flex items-center gap-2 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
