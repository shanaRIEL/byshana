"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/common/Toast";
import ListingCard from "@/components/listing/ListingCard";
import WishlistButton from "@/components/listing/WishlistButton";
import BookingModal from "@/components/booking/BookingModal";
import ReviewCard from "@/components/review/ReviewCard";
import type { ReviewData } from "@/components/review/ReviewCard";
import RatingSummary from "@/components/review/RatingSummary";
import ReviewForm from "@/components/review/ReviewForm";
import { formatPrice, getDaysBetween } from "@/lib/utils";
import type { DbListing } from "@/types";

interface ItemDetailViewProps {
  listing: DbListing;
  similar: DbListing[];
  isWishlisted: boolean;
  userCompletedBookingId?: string | null;
  openReviewForm?: boolean;
}

const categoryLabels: Record<string, string> = {
  women: "Womenswear",
  men: "Menswear",
  accessories: "Accessories",
};

const categoryPages: Record<string, string> = {
  women: "/browse?category=women",
  men: "/browse?category=men",
  accessories: "/browse?category=accessories",
};

export default function ItemDetailView({ listing, similar, isWishlisted, userCompletedBookingId, openReviewForm }: ItemDetailViewProps) {
  const { showToast } = useToast();

  const images = listing.images ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [rentFrom, setRentFrom] = useState("");
  const [rentTo, setRentTo] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(!!openReviewForm);

  const days = getDaysBetween(rentFrom, rentTo);
  const rentalCost = listing.rentalPricePerDay * days;
  const total = rentalCost + listing.deposit;

  const avgRating = listing.reviews?.length
    ? listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length
    : 0;

  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  listing.reviews?.forEach((r) => {
    ratingDistribution[r.rating] = (ratingDistribution[r.rating] ?? 0) + 1;
  });

  const reviewsAsReviewData: ReviewData[] = (listing.reviews ?? [])
    .filter((r): r is typeof r & { id: string } => !!r.id)
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment ?? null,
      createdAt: r.createdAt ?? new Date(),
      user: {
        id: r.user?.id ?? "",
        name: r.user?.name ?? null,
        image: r.user?.image ?? null,
      },
    }));

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Link copied to clipboard");
      }
    } catch {
      // user cancelled share or clipboard failed silently
    }
  }, [listing.title, showToast]);

  const inputClasses =
    "py-2.5 px-3.5 border-[1.5px] border-b6 rounded-xl font-montserrat text-[0.82rem] text-b1 bg-b8 outline-none transition-colors duration-200 focus:border-b4";

  return (
    <div className="px-12 max-[768px]:px-6 py-10">
      <nav className="flex items-center gap-1.5 text-[0.75rem] font-montserrat text-b4 mb-8 flex-wrap">
        <Link href="/" className="hover:text-b1 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/browse" className="hover:text-b1 transition-colors">Browse</Link>
        <span>/</span>
        {listing.category && (
          <>
            <Link href={categoryPages[listing.category] ?? "/browse"} className="hover:text-b1 transition-colors">
              {categoryLabels[listing.category] ?? listing.category}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-b1 font-medium truncate max-w-[200px]">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-2 gap-12 items-start max-[900px]:grid-cols-1">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-b7">
            {images.length > 0 ? (
              <Image
                src={images[activeIdx].url}
                alt={listing.title}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-b5 font-playfair text-6xl">
                {listing.title.charAt(0)}
              </div>
            )}

            {!listing.isAvailable && (
              <div className="absolute inset-0 bg-b1/60 flex items-center justify-center">
                <span className="bg-b8 text-b1 font-montserrat font-semibold text-[0.88rem] px-6 py-2 rounded-full">
                  Currently unavailable
                </span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIdx(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors cursor-pointer ${
                    i === activeIdx ? "border-b3" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${listing.title} ${i + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col gap-5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-block text-[0.66rem] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-xl bg-b7 text-b3 border border-b6">
              {categoryLabels[listing.category] ?? listing.category}
            </span>
            {listing.occasion && (
              <span className="inline-block text-[0.66rem] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-xl bg-b7 text-b3 border border-b6">
                {listing.occasion}
              </span>
            )}
            {listing.isVerified && (
              <span className="inline-block text-[0.66rem] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-xl bg-accent/10 text-accent">
                Verified
              </span>
            )}
          </div>

          <h1 className="font-playfair text-[2rem] text-b1 leading-tight">
            {listing.title}
          </h1>

          <div className="flex items-center gap-4 flex-wrap">
            {listing.owner && (
              <div className="flex items-center gap-2">
                {listing.owner.image ? (
                  <Image
                    src={listing.owner.image}
                    alt={listing.owner.name ?? "Owner"}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-b6 flex items-center justify-center text-[0.65rem] font-semibold text-b3">
                    {(listing.owner.name ?? "A").charAt(0)}
                  </div>
                )}
                <span className="text-[0.82rem] text-b4 font-montserrat">
                  {listing.owner.name ?? "Anonymous"}
                </span>
              </div>
            )}

            {avgRating > 0 && (
              <span className="flex items-center gap-1 text-[0.78rem] text-b3 font-montserrat">
                <svg className="w-4 h-4 fill-warm" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {avgRating.toFixed(1)}
                <span className="text-b5">
                  ({listing.reviews?.length ?? 0} {listing.reviews?.length === 1 ? "review" : "reviews"})
                </span>
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-playfair text-[2.2rem] text-b2">
              {formatPrice(listing.rentalPricePerDay)}
            </span>
            <span className="text-[0.82rem] text-b4 font-montserrat">/day</span>
            {listing.purchasePrice != null && (
              <span className="text-[0.9rem] text-accent font-medium font-montserrat ml-2">
                Buy now {formatPrice(listing.purchasePrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[0.78rem] text-b4 font-montserrat">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {listing.location}
            </span>
            <span className="w-1 h-1 rounded-full bg-b5" />
            <span>{listing.condition}</span>
          </div>

          <div className="h-px bg-b6" />

          <p className="text-[0.84rem] text-b3 leading-relaxed font-light">
            {listing.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="text-[0.68rem] font-montserrat px-2.5 py-1 rounded-full bg-b7 text-b3 border border-b6">
              {listing.size}
            </span>
            {listing.brand && (
              <span className="text-[0.68rem] font-montserrat px-2.5 py-1 rounded-full bg-b7 text-b3 border border-b6">
                {listing.brand}
              </span>
            )}
            <span className="text-[0.68rem] font-montserrat px-2.5 py-1 rounded-full bg-b7 text-b3 border border-b6">
              {listing.condition}
            </span>
          </div>

          <div>
            <p className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3 mb-2 font-montserrat">
              Deposit
            </p>
            <p className="text-[0.88rem] text-b1 font-montserrat">
              {formatPrice(listing.deposit)} (refundable)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3 font-montserrat">
                Rent from
              </label>
              <input
                type="date"
                value={rentFrom}
                onChange={(e) => setRentFrom(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3 font-montserrat">
                Rent to
              </label>
              <input
                type="date"
                value={rentTo}
                onChange={(e) => setRentTo(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          {days > 0 && (
            <div className="bg-b7 rounded-[14px] p-5 border-[0.5px] border-b6">
              <div className="flex justify-between text-[0.82rem] text-b3 mb-1.5">
                <span>{formatPrice(listing.rentalPricePerDay)} x {days} day{days !== 1 ? "s" : ""}</span>
                <span>{formatPrice(rentalCost)}</span>
              </div>
              <div className="flex justify-between text-[0.82rem] text-b3 mb-1.5">
                <span>Refundable deposit</span>
                <span>{formatPrice(listing.deposit)}</span>
              </div>
              <div className="flex justify-between font-semibold text-b1 text-[0.88rem] mt-2.5 pt-2.5 border-t-[0.5px] border-b6">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowBookingModal(true)}
            disabled={!listing.isAvailable}
            className="w-full bg-b1 text-b8 border-none py-4 rounded-[14px] text-[0.88rem] font-montserrat font-semibold cursor-pointer transition-colors duration-200 tracking-[0.04em] hover:bg-b2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {listing.isAvailable ? "Rent now" : "Currently unavailable"}
          </button>

          {listing.purchasePrice != null && (
            <button
              onClick={() => showToast("Purchase flow coming soon")}
              disabled={!listing.isAvailable}
              className="w-full bg-transparent text-accent border-[1.5px] border-accent py-[0.9rem] rounded-[14px] text-[0.84rem] font-montserrat font-medium cursor-pointer transition-all duration-200 hover:bg-accent hover:text-b8 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy now for {formatPrice(listing.purchasePrice)}
            </button>
          )}

          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 border border-b6 rounded-[10px] text-[0.78rem] font-montserrat font-medium text-b4 transition-all duration-200 hover:border-b4">
              <WishlistButton
                listingId={listing.id}
                initialWishlisted={isWishlisted}
                size={16}
              />
              {isWishlisted ? "Saved" : "Save"}
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 border border-b6 rounded-[10px] text-[0.78rem] font-montserrat font-medium text-b4 transition-all duration-200 hover:border-b4 cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {listing.reviews && listing.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="font-playfair text-[1.5rem] text-b1 mb-6">
            Reviews ({listing.reviews.length})
          </h2>
          <div className="bg-b8 border border-b6 rounded-[14px] p-6 mb-6">
            <RatingSummary
              average={avgRating}
              count={listing.reviews.length}
              distribution={ratingDistribution}
            />
          </div>
          <div className="flex flex-col gap-4">
            {reviewsAsReviewData.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {userCompletedBookingId && !showReviewForm && (
        <section className="mt-8">
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-5 py-2.5 bg-b1 text-b8 rounded-[10px] text-[0.82rem] font-montserrat font-semibold cursor-pointer transition-colors hover:bg-b2"
          >
            Write a review
          </button>
        </section>
      )}

      {showReviewForm && userCompletedBookingId && (
        <section className="mt-8 max-w-lg">
          <ReviewForm
            bookingId={userCompletedBookingId}
            listingTitle={listing.title}
            onSuccess={() => setShowReviewForm(false)}
          />
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-playfair text-[1.5rem] text-b1 mb-6">Similar listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similar.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      )}

      <BookingModal
        listingId={listing.id}
        listingTitle={listing.title}
        listingImage={images[0]?.url ?? null}
        dailyRate={listing.rentalPricePerDay}
        deposit={listing.deposit}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
}
