"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleWishlistAction } from "@/app/wishlist/actions";
import { useToast } from "@/components/common/Toast";

interface WishlistButtonProps {
  listingId: string;
  initialWishlisted: boolean;
  size?: number;
  className?: string;
}

export default function WishlistButton({
  listingId,
  initialWishlisted,
  size = 20,
  className = "",
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    const previous = wishlisted;
    setWishlisted(!previous);

    startTransition(async () => {
      const result = await toggleWishlistAction(listingId);
      if (!result.success) {
        setWishlisted(previous);
        if (result.error?.includes("signed in")) {
          router.push("/sign-in");
        } else {
          showToast(result.error ?? "Failed to update wishlist");
        }
      } else {
        showToast(result.wishlisted ? "Saved to wishlist" : "Removed from wishlist");
        router.refresh();
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center justify-center transition-transform duration-200 hover:scale-110 disabled:opacity-50 cursor-pointer ${className}`}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={wishlisted ? "#8B4513" : "none"}
        stroke={wishlisted ? "#8B4513" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
