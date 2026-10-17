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
    <div className="bg-white border border-line overflow-hidden">
      <div className="flex gap-4 p-4 max-[600px]:flex-col">
        <Link
          href={`/item/${booking.listingId}`}
          className="shrink-0 w-28 h-28 overflow-hidden bg-sand relative"
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
            <div className="flex items-center justify-center w-full h-full text-ink/20 font-playfair text-xl">
              {booking.listing.title.charAt(0)}
            </div>
          )}
        </Link>

        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/item/${booking.listingId}`}
              className="font-montserrat text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-ink hover:text-ink/60 transition-colors truncate"
            >
              {booking.listing.title}
            </Link>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="flex items-center gap-2 text-[0.72rem] text-ink/45 font-montserrat">
            <span>{role === "renter" ? `Listed by ${booking.listing.owner.name ?? "Anonymous"}` : `Booked by ${booking.renter.name ?? "Anonymous"}`}</span>
            <span className="w-1 h-1 rounded-full bg-ink/25" />
            <span>{booking.listing.location}</span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.76rem] font-montserrat text-ink/65">
            <span>
              <span className="text-ink/35">From:</span> {formatDate(booking.startDate)}
            </span>
            <span>
              <span className="text-ink/35">To:</span> {formatDate(booking.endDate)}
            </span>
            <span>
              <span className="text-ink/35">Duration:</span> {booking.totalDays} day{booking.totalDays !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-line">
            <div className="flex items-baseline gap-2">
              <span className="font-playfair text-[1.05rem] text-ink">
                {formatPrice(booking.total)}
              </span>
              <span className="text-[0.6rem] tracking-[0.1em] uppercase text-ink/40 font-montserrat">total</span>
            </div>
            <span className="text-[0.66rem] text-ink/50 font-montserrat">
              {formatPrice(booking.dailyRate)}/day
            </span>
          </div>
        </div>
      </div>

      {children && (
        <div className="px-4 pb-4 pt-2 border-t border-line flex items-center gap-2 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
