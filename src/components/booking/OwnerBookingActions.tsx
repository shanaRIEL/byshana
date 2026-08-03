"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  acceptBookingAction,
  rejectBookingAction,
  startBookingAction,
  completeBookingAction,
} from "@/app/bookings/actions";
import { useToast } from "@/components/common/Toast";

interface OwnerBookingActionsProps {
  bookingId: string;
  status: string;
}

export default function OwnerBookingActions({ bookingId, status }: OwnerBookingActionsProps) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const run = async (action: (id: string) => Promise<{ success: boolean; error?: string }>) => {
    startTransition(async () => {
      const result = await action(bookingId);
      if (result.success) {
        showToast("Booking updated");
        router.refresh();
      } else {
        showToast(result.error ?? "Failed to update");
      }
    });
  };

  const btnBase = "px-3.5 py-1.5 rounded-[8px] text-[0.75rem] font-montserrat font-medium transition-colors disabled:opacity-40 cursor-pointer";

  if (status === "pending") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => run(acceptBookingAction)}
          disabled={isPending}
          className={`${btnBase} bg-b1 text-b8 hover:bg-b2`}
        >
          Accept
        </button>
        <button
          onClick={() => run(rejectBookingAction)}
          disabled={isPending}
          className={`${btnBase} border border-b6 text-b4 hover:border-red-300 hover:text-red-600`}
        >
          Reject
        </button>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <button
        onClick={() => run(startBookingAction)}
        disabled={isPending}
        className={`${btnBase} bg-b1 text-b8 hover:bg-b2`}
      >
        {isPending ? "Starting..." : "Mark as active"}
      </button>
    );
  }

  if (status === "active") {
    return (
      <button
        onClick={() => run(completeBookingAction)}
        disabled={isPending}
        className={`${btnBase} bg-b1 text-b8 hover:bg-b2`}
      >
        {isPending ? "Completing..." : "Mark as completed"}
      </button>
    );
  }

  return null;
}
