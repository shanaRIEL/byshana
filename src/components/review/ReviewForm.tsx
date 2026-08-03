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
    <div className="bg-b8 border border-b6 rounded-[14px] p-5">
      <h3 className="font-playfair text-[1.15rem] text-b1 mb-1">
        {isEditing ? "Edit your review" : "Leave a review"}
      </h3>
      {listingTitle && (
        <p className="text-[0.78rem] text-b5 font-montserrat mb-4">
          for <span className="text-b3 font-medium">{listingTitle}</span>
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
              className={`w-7 h-7 transition-colors ${star <= activeRating ? "fill-warm" : "fill-b6 hover:fill-warm/50"}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {activeRating > 0 && (
          <span className="text-[0.78rem] text-b4 font-montserrat ml-2">
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
        className="w-full py-2.5 px-3.5 border-[1.5px] border-b6 rounded-xl font-montserrat text-[0.82rem] text-b1 bg-b8 outline-none transition-colors duration-200 focus:border-b4 resize-none"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={isPending || rating < 1}
          className="px-5 py-2.5 bg-b1 text-b8 rounded-[10px] text-[0.82rem] font-montserrat font-semibold cursor-pointer transition-colors hover:bg-b2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : isEditing ? "Update review" : "Submit review"}
        </button>
        {isEditing && (
          <button
            onClick={onSuccess}
            disabled={isPending}
            className="px-5 py-2.5 border border-b6 text-b4 rounded-[10px] text-[0.82rem] font-montserrat font-medium cursor-pointer transition-colors hover:border-b4 disabled:opacity-40"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
