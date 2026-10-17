"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { hasReviewedBookingAction } from "@/app/reviews/actions";

interface LeaveReviewButtonProps {
  bookingId: string;
  listingId: string;
}

export default function LeaveReviewButton({ bookingId, listingId }: LeaveReviewButtonProps) {
  const [hasReviewed, setHasReviewed] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const reviewed = await hasReviewedBookingAction(bookingId);
      setHasReviewed(reviewed);
    });
  }, [bookingId, startTransition]);

  if (hasReviewed === null || isPending) return null;

  if (hasReviewed) {
    return (
      <span className="px-4 py-2 text-[0.6rem] font-montserrat font-semibold tracking-[0.12em] uppercase text-ink/35 border border-line">
        Reviewed
      </span>
    );
  }

  return (
    <Link
      href={`/item/${listingId}?review=true`}
      className="px-4 py-2 bg-ink text-b8 border border-ink text-[0.6rem] font-montserrat font-semibold tracking-[0.12em] uppercase hover:bg-transparent hover:text-ink transition-colors"
    >
      Leave Review
    </Link>
  );
}
