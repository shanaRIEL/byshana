"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/common/Toast";
import { createReviewAction, updateReviewAction } from "@/app/reviews/actions";

interface ReviewFormProps {
  bookingId: string;
  listingTitle?: string;
  initialRating?: number;
  initialComment?: string;
  existingReviewId?: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  bookingId,
  listingTitle,
  initialRating = 0,
  initialComment = "",
  existingReviewId,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const isEditing = !!existingReviewId;

  const handleSubmit = () => {
    if (rating < 1 || rating > 5) {
      showToast("Please select a rating");
      return;
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateReviewAction(existingReviewId, { rating, comment: comment.trim() || undefined })
        : await createReviewAction({ bookingId, rating, comment: comment.trim() || undefined });

      if (result.success) {
        showToast(isEditing ? "Review updated" : "Review submitted");
        onSuccess?.();
        router.refresh();
      } else {
        showToast(result.error ?? "Failed to submit review");
      }
    });
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="bg-white border border-line p-6">
      <h3 className="font-playfair text-[1.25rem] text-ink mb-1">
        {isEditing ? "Edit your review" : "Leave a review"}
      </h3>
      {listingTitle && (
        <p className="text-[0.64rem] tracking-[0.12em] uppercase text-ink/40 font-montserrat mb-5">
          for <span className="text-ink/70 font-medium">{listingTitle}</span>
        </p>
      )}

      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="cursor-pointer p-0.5"
          >
            <svg
              className={`w-7 h-7 transition-colors ${star <= activeRating ? "fill-ink" : "fill-line hover:fill-ink/30"}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {activeRating > 0 && (
          <span className="text-[0.72rem] tracking-[0.08em] uppercase text-ink/45 font-montserrat ml-2">
            {activeRating === 1 && "Poor"}
            {activeRating === 2 && "Fair"}
            {activeRating === 3 && "Good"}
            {activeRating === 4 && "Very good"}
            {activeRating === 5 && "Excellent"}
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        className="w-full py-2.5 px-3.5 border border-line rounded-none font-montserrat text-[0.82rem] text-ink bg-white outline-none transition-colors duration-200 focus:border-ink/40 resize-none"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={isPending || rating < 1}
          className="px-5 py-2.5 bg-ink text-b8 border border-ink rounded-none text-[0.64rem] font-montserrat font-semibold tracking-[0.14em] uppercase cursor-pointer transition-colors hover:bg-transparent hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : isEditing ? "Update review" : "Submit review"}
        </button>
        {isEditing && (
          <button
            onClick={onSuccess}
            disabled={isPending}
            className="px-5 py-2.5 border border-line text-ink/55 rounded-none text-[0.64rem] font-montserrat font-semibold tracking-[0.14em] uppercase cursor-pointer transition-colors hover:border-ink/40 hover:text-ink disabled:opacity-40"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
