"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelBookingAction } from "@/app/bookings/actions";
import { useToast } from "@/components/common/Toast";

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelBookingAction(bookingId);
      if (result.success) {
        showToast("Booking cancelled");
        router.refresh();
      } else {
        showToast(result.error ?? "Failed to cancel");
      }
    });
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="px-4 py-2 border border-line text-[0.6rem] font-montserrat font-semibold tracking-[0.12em] uppercase text-ink/55 hover:border-b2 hover:text-b2 transition-colors disabled:opacity-40 cursor-pointer"
    >
      {isPending ? "Cancelling..." : "Cancel"}
    </button>
  );
}
