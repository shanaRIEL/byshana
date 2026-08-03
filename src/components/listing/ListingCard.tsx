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
      className="group flex flex-col bg-b8 rounded-[16px] border border-b6 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5] bg-b7 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-b5 font-playfair text-3xl">
            {listing.title.charAt(0)}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <div className="bg-b8/80 backdrop-blur-sm rounded-full p-1">
            <WishlistButton
              listingId={listing.id}
              initialWishlisted={isWishlisted}
              size={18}
            />
          </div>
        </div>

        {listing.isVerified && (
          <span className="absolute top-3 left-3 bg-accent text-b8 text-[0.65rem] font-semibold font-montserrat px-2.5 py-1 rounded-full">
            Verified
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-montserrat font-semibold text-[0.88rem] text-b1 leading-snug line-clamp-2">
            {listing.title}
          </h3>
          {rating > 0 && (
            <span className="shrink-0 flex items-center gap-1 text-[0.72rem] text-b3 font-montserrat">
              <svg className="w-3.5 h-3.5 fill-warm" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        {listing.brand && (
          <p className="text-[0.75rem] text-b4 font-montserrat">{listing.brand}</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          <span className="text-[0.65rem] font-montserrat px-2 py-0.5 rounded-full bg-b7 text-b3 border border-b6">
            {listing.category}
          </span>
          <span className="text-[0.65rem] font-montserrat px-2 py-0.5 rounded-full bg-b7 text-b3 border border-b6">
            {listing.size}
          </span>
          <span className="text-[0.65rem] font-montserrat px-2 py-0.5 rounded-full bg-b7 text-b3 border border-b6">
            {listing.condition}
          </span>
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between border-t border-b6/50">
          <div>
            <span className="font-playfair text-[1.15rem] text-b1 font-semibold">
              {formatPrice(listing.rentalPricePerDay)}
            </span>
            <span className="text-[0.68rem] text-b4 font-montserrat ml-0.5">/day</span>
            {listing.purchasePrice && (
              <p className="text-[0.68rem] text-b4 font-montserrat">
                Buy: {formatPrice(listing.purchasePrice)}
              </p>
            )}
          </div>
          <span className="text-[0.68rem] text-b4 font-montserrat flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {listing.location}
          </span>
        </div>

        {reviewCount > 0 && (
          <p className="text-[0.65rem] text-b5 font-montserrat">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </p>
        )}
      </div>
    </Link>
  );
}
