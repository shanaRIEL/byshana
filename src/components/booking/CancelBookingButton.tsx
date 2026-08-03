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
      className="px-3.5 py-1.5 rounded-[8px] border border-b6 text-[0.75rem] font-montserrat font-medium text-b4 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-40 cursor-pointer"
    >
      {isPending ? "Cancelling..." : "Cancel"}
    </button>
  );
}
