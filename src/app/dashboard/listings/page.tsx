"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getListingsByUserAction, deleteListingAction } from "@/app/list/actions";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";
import DeleteConfirmDialog from "@/components/dashboard/DeleteConfirmDialog";
import ListingsSkeleton from "@/components/dashboard/ListingsSkeleton";

interface DashboardListing {
  id: string;
  title: string;
  category: string;
  rentalPricePerDay: number;
  purchasePrice: number | null;
  status: string;
  isAvailable: boolean;
  createdAt: Date;
  images: { id: string; url: string; order: number }[];
  reviews: { rating: number }[];
}

const categoryLabels: Record<string, string> = {
  women: "Womenswear",
  men: "Menswear",
  accessories: "Accessories",
  occasion: "Occasionwear",
  street: "Streetwear",
};

export default function DashboardListingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [listings, setListings] = useState<DashboardListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DashboardListing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getListingsByUserAction();
        if (cancelled) return;
        if (result.success && result.data) {
          setListings(result.data as unknown as DashboardListing[]);
        } else {
          setError(result.error ?? "Failed to load listings");
        }
      } catch {
        if (!cancelled) setError("Failed to load listings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [retryCount]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const result = await deleteListingAction(deleteTarget.id);
      if (result.success) {
        setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        setDeleteTarget(null);
        showToast("Listing deleted");
        router.refresh();
      } else {
        showToast(result.error ?? "Failed to delete listing");
      }
    } catch {
      showToast("Failed to delete listing");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const avgRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-playfair text-[1.8rem] text-b1 font-normal mb-2">
          My Listings
        </h1>
        <p className="text-[0.88rem] text-b4 font-light mb-8">
          Manage the clothes you&apos;ve listed for rent or sale.
        </p>
        <ListingsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="font-playfair text-[1.8rem] text-b1 font-normal mb-2">
          My Listings
        </h1>
        <p className="text-[0.88rem] text-b4 font-light mb-8">
          Manage the clothes you&apos;ve listed for rent or sale.
        </p>
        <div className="bg-b7 border border-b6 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <p className="text-[0.88rem] text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              setRetryCount((c) => c + 1);
            }}
            className="px-5 py-2.5 bg-b1 text-b8 rounded-[10px] text-[0.82rem] font-montserrat font-semibold cursor-pointer hover:bg-b2 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-[1.8rem] text-b1 font-normal mb-2">
            My Listings
          </h1>
          <p className="text-[0.88rem] text-b4 font-light">
            Manage the clothes you&apos;ve listed for rent or sale.
          </p>
        </div>
        <Link
          href="/list"
          className="px-5 py-2.5 bg-b1 text-b8 rounded-[10px] text-[0.82rem] font-montserrat font-semibold hover:bg-b2 transition-colors"
        >
          + New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-b7 border border-b6 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-b6 flex items-center justify-center mb-5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-b4"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <h2 className="font-playfair text-[1.2rem] text-b1 mb-2">
            You haven&apos;t listed anything yet
          </h2>
          <p className="text-[0.82rem] text-b4 font-light max-w-sm mb-6">
            Start listing your wardrobe items to earn from rentals and sales.
          </p>
          <Link
            href="/list"
            className="px-6 py-3 bg-b1 text-b8 rounded-[12px] text-[0.84rem] font-montserrat font-semibold hover:bg-b2 transition-colors"
          >
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => {
            const imageUrl = listing.images?.[0]?.url ?? null;
            const rating = avgRating(listing.reviews);

            return (
              <div
                key={listing.id}
                className="bg-b8 border border-b6 rounded-[16px] overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Link href={`/item/${listing.id}`} className="block">
                  <div className="relative aspect-[4/5] bg-b7 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-b5 font-playfair text-3xl">
                        {listing.title.charAt(0)}
                      </div>
                    )}

                    <span
                      className={`absolute top-3 left-3 text-[0.65rem] font-semibold tracking-[0.06em] uppercase px-2.5 py-1 rounded-full ${
                        listing.isAvailable
                          ? "bg-b8/90 text-b2"
                          : "bg-b1/70 text-b8"
                      }`}
                    >
                      {listing.isAvailable ? "Published" : "Paused"}
                    </span>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link
                      href={`/item/${listing.id}`}
                      className="font-montserrat font-semibold text-[0.88rem] text-b1 hover:text-b3 transition-colors line-clamp-1"
                    >
                      {listing.title}
                    </Link>
                    {rating > 0 && (
                      <span className="flex items-center gap-1 text-[0.72rem] text-b3 font-montserrat shrink-0">
                        <svg
                          className="w-3 h-3 fill-warm"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[0.65rem] font-montserrat px-2 py-0.5 rounded-full bg-b7 text-b3 border border-b6">
                      {categoryLabels[listing.category] ?? listing.category}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-playfair text-[1.1rem] text-b2">
                      {formatPrice(listing.rentalPricePerDay)}
                    </span>
                    <span className="text-[0.72rem] text-b5 font-montserrat">
                      /day
                    </span>
                    {listing.purchasePrice != null && (
                      <>
                        <span className="text-b6 text-[0.72rem]">|</span>
                        <span className="text-[0.78rem] text-accent font-medium font-montserrat">
                          Buy {formatPrice(listing.purchasePrice)}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-[0.72rem] text-b5 font-montserrat mb-4">
                    Listed {formatDate(listing.createdAt)}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/listings/edit/${listing.id}`}
                      className="flex-1 text-center px-3 py-2 border border-b6 rounded-[8px] text-[0.75rem] font-montserrat font-medium text-b4 hover:border-b4 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(listing)}
                      className="flex-1 text-center px-3 py-2 border border-b6 rounded-[8px] text-[0.75rem] font-montserrat font-medium text-b4 hover:border-red-300 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title={deleteTarget?.title ?? ""}
      />
    </div>
  );
}
