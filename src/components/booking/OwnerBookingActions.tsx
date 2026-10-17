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

  const btnBase = "px-4 py-2 border text-[0.6rem] font-montserrat font-semibold tracking-[0.12em] uppercase transition-colors disabled:opacity-40 cursor-pointer";

  if (status === "pending") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => run(acceptBookingAction)}
          disabled={isPending}
          className={`${btnBase} bg-ink text-b8 border-ink hover:bg-transparent hover:text-ink`}
        >
          Accept
        </button>
        <button
          onClick={() => run(rejectBookingAction)}
          disabled={isPending}
          className={`${btnBase} border-line text-ink/55 hover:border-b2 hover:text-b2`}
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
        className={`${btnBase} bg-ink text-b8 border-ink hover:bg-transparent hover:text-ink`}
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
        className={`${btnBase} bg-ink text-b8 border-ink hover:bg-transparent hover:text-ink`}
      >
        {isPending ? "Completing..." : "Mark as completed"}
      </button>
    );
  }

  return null;
}
