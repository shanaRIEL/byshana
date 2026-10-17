"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createBookingAction } from "@/app/bookings/actions";
import { formatPrice, getDaysBetween } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";

interface BookingModalProps {
  listingId: string;
  listingTitle: string;
  listingImage?: string | null;
  dailyRate: number;
  deposit: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({
  listingId,
  listingTitle,
  listingImage,
  dailyRate,
  deposit,
  isOpen,
  onClose,
}: BookingModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  if (!isOpen) return null;

  const days = getDaysBetween(startDate, endDate);
  const rentalCost = dailyRate * days;
  const total = rentalCost + deposit;

  const handleSubmit = async () => {
    if (!startDate || !endDate || days < 1) return;
    setIsSubmitting(true);

    try {
      const result = await createBookingAction({
        listingId,
        startDate,
        endDate,
      });

      if (result.success) {
        showToast("Booking request submitted!");
        onClose();
        router.push("/bookings");
      } else {
        showToast(result.error ?? "Failed to create booking");
      }
    } catch {
      showToast("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white border border-line w-full max-w-md p-7 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-sand flex items-center justify-center text-ink/50 hover:text-ink transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-playfair text-[1.4rem] text-ink mb-1">Confirm booking</h2>
        <p className="text-[0.66rem] tracking-[0.1em] uppercase text-ink/45 font-montserrat mb-5">{listingTitle}</p>

        {listingImage && (
          <div className="relative w-full h-36 overflow-hidden bg-sand mb-5">
            <Image src={listingImage} alt={listingTitle} fill className="object-cover" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50 font-montserrat">
              Start date
            </label>
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="py-2.5 px-3 border border-line rounded-none font-montserrat text-[0.8rem] text-ink bg-white outline-none focus:border-ink/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50 font-montserrat">
              End date
            </label>
            <input
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="py-2.5 px-3 border border-line rounded-none font-montserrat text-[0.8rem] text-ink bg-white outline-none focus:border-ink/40"
            />
          </div>
        </div>

        {days > 0 && (
          <div className="bg-sand p-5 mb-6 border border-line">
            <div className="flex justify-between text-[0.78rem] text-ink/60 mb-2 font-montserrat">
              <span>{formatPrice(dailyRate)} × {days} day{days !== 1 ? "s" : ""}</span>
              <span>{formatPrice(rentalCost)}</span>
            </div>
            <div className="flex justify-between text-[0.78rem] text-ink/60 mb-2 font-montserrat">
              <span>Refundable deposit</span>
              <span>{formatPrice(deposit)}</span>
            </div>
            <div className="flex justify-between font-semibold text-ink text-[0.85rem] mt-2.5 pt-2.5 border-t border-line font-montserrat">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-none border border-line text-[0.64rem] font-montserrat font-semibold tracking-[0.14em] uppercase text-ink/55 hover:border-ink/40 hover:text-ink transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!startDate || !endDate || days < 1 || isSubmitting}
            className="flex-1 py-3.5 rounded-none bg-ink text-b8 border border-ink text-[0.64rem] font-montserrat font-semibold tracking-[0.14em] uppercase hover:bg-transparent hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Booking..." : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
