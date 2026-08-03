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
      <span className="px-3.5 py-1.5 rounded-[8px] text-[0.75rem] font-montserrat font-medium text-b5 border border-b6">
        Reviewed
      </span>
    );
  }

  return (
    <Link
      href={`/item/${listingId}?review=true`}
      className="px-3.5 py-1.5 rounded-[8px] text-[0.75rem] font-montserrat font-medium bg-accent text-b8 hover:bg-accent/90 transition-colors"
    >
      Leave Review
    </Link>
  );
}
