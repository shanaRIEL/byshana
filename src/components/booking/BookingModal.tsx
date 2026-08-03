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
      <div className="absolute inset-0 bg-b1/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-b8 rounded-[20px] border border-b6 w-full max-w-md p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-b7 flex items-center justify-center text-b4 hover:text-b1 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-playfair text-[1.3rem] text-b1 mb-1">Confirm booking</h2>
        <p className="text-[0.78rem] text-b4 font-montserrat mb-5">{listingTitle}</p>

        {listingImage && (
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-b7 mb-4">
            <Image src={listingImage} alt={listingTitle} fill className="object-cover" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[0.65rem] font-semibold tracking-[0.08em] uppercase text-b3 font-montserrat">
              Start date
            </label>
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="py-2.5 px-3 border-[1.5px] border-b6 rounded-xl font-montserrat text-[0.82rem] text-b1 bg-b7 outline-none focus:border-b4"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[0.65rem] font-semibold tracking-[0.08em] uppercase text-b3 font-montserrat">
              End date
            </label>
            <input
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="py-2.5 px-3 border-[1.5px] border-b6 rounded-xl font-montserrat text-[0.82rem] text-b1 bg-b7 outline-none focus:border-b4"
            />
          </div>
        </div>

        {days > 0 && (
          <div className="bg-b7 rounded-[14px] p-4 mb-5 border border-b6/50">
            <div className="flex justify-between text-[0.8rem] text-b3 mb-1.5">
              <span>{formatPrice(dailyRate)} x {days} day{days !== 1 ? "s" : ""}</span>
              <span>{formatPrice(rentalCost)}</span>
            </div>
            <div className="flex justify-between text-[0.8rem] text-b3 mb-1.5">
              <span>Refundable deposit</span>
              <span>{formatPrice(deposit)}</span>
            </div>
            <div className="flex justify-between font-semibold text-b1 text-[0.85rem] mt-2 pt-2 border-t border-b6">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-[12px] border border-b6 text-[0.82rem] font-montserrat font-medium text-b4 hover:border-b4 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!startDate || !endDate || days < 1 || isSubmitting}
            className="flex-1 py-3 rounded-[12px] bg-b1 text-b8 text-[0.82rem] font-montserrat font-semibold hover:bg-b2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Booking..." : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
