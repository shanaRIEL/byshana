import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import WishlistButton from "@/components/listing/WishlistButton";
import type { DbListing } from "@/types";

function avgRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

interface ListingCardProps {
  listing: DbListing;
  isWishlisted?: boolean;
}

export default function ListingCard({ listing, isWishlisted = false }: ListingCardProps) {
  const imageUrl = listing.images?.[0]?.url ?? null;
  const rating = avgRating(listing.reviews ?? []);
  const reviewCount = listing.reviews?.length ?? 0;

  return (
    <Link
      href={`/item/${listing.id}`}
      className="group flex flex-col bg-white cursor-pointer"
    >
      <div className="relative aspect-[3/4] bg-sand overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-ink/20 font-playfair text-5xl">
            {listing.title.charAt(0)}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/90 backdrop-blur-sm p-1.5">
            <WishlistButton
              listingId={listing.id}
              initialWishlisted={isWishlisted}
              size={15}
              className="text-ink hover:scale-125"
            />
          </div>
        </div>

        {listing.isVerified && (
          <span className="absolute top-3 left-3 bg-white/95 text-ink text-[0.55rem] font-semibold tracking-[0.14em] uppercase px-2.5 py-1">
            Verified
          </span>
        )}
      </div>

      <div className="pt-3.5 pb-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-ink leading-snug line-clamp-2">
            {listing.title}
          </h3>
          {rating > 0 && (
            <span className="shrink-0 flex items-center gap-1 text-[0.66rem] text-ink/50">
              <svg className="w-3 h-3 fill-ink/70" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        {listing.brand && (
          <p className="text-[0.66rem] tracking-[0.06em] uppercase text-ink/40 mt-0.5">
            {listing.brand}
          </p>
        )}

        <div className="mt-1.5 flex items-center gap-2">
          <span className="font-playfair text-[1.02rem] text-ink leading-none">
            {formatPrice(listing.rentalPricePerDay)}
          </span>
          <span className="text-[0.62rem] tracking-[0.08em] uppercase text-ink/45">/ day</span>
          <span className="ml-auto text-[0.62rem] tracking-[0.08em] uppercase text-ink/40 border border-line px-1.5 py-0.5">
            {listing.size}
          </span>
        </div>

        {reviewCount > 0 && (
          <p className="text-[0.62rem] tracking-[0.06em] uppercase text-ink/35 mt-1.5">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"} · {listing.location}
          </p>
        )}
      </div>
    </Link>
  );
}
