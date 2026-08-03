"use client";

import Image from "next/image";

interface ReviewUser {
  id: string;
  name: string | null;
  image: string | null;
}

export interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: ReviewUser;
  booking?: { id: string; startDate: Date; endDate: Date } | null;
}

interface ReviewCardProps {
  review: ReviewData;
  actions?: React.ReactNode;
}

export default function ReviewCard({ review, actions }: ReviewCardProps) {
  return (
    <div className="bg-b8 border border-b6 rounded-[14px] p-5">
      <div className="flex items-center gap-3 mb-3">
        {review.user.image ? (
          <Image
            src={review.user.image}
            alt={review.user.name ?? "Reviewer"}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-b6 flex items-center justify-center text-[0.68rem] font-semibold text-b3">
            {(review.user.name ?? "A").charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[0.82rem] font-semibold text-b1 font-montserrat truncate">
            {review.user.name ?? "Anonymous"}
          </p>
          <p className="text-[0.68rem] text-b5 font-montserrat">
            {new Date(review.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, s) => (
            <svg
              key={s}
              className={`w-3.5 h-3.5 ${s < review.rating ? "fill-warm" : "fill-b6"}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      {review.comment && (
        <p className="text-[0.82rem] text-b3 font-light leading-relaxed">
          {review.comment}
        </p>
      )}

      {actions && (
        <div className="mt-3 pt-3 border-t border-b6/50 flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
