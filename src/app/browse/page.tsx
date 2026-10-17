import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getListings, getUserWishlistIds } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/listing/ListingCard";
import ListingSkeleton from "@/components/listing/ListingSkeleton";
import FilterPanel from "@/components/listing/FilterPanel";
import Pagination from "@/components/listing/Pagination";
import EmptyState from "@/components/listing/EmptyState";
import Footer from "@/components/footer/Footer";
import { browseFooterColumns } from "@/data";

interface BrowsePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function ListingsGrid({ searchParams }: BrowsePageProps) {
  const params = await searchParams;

  const category = typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;
  const size = typeof params.size === "string" ? params.size : undefined;
  const condition = typeof params.condition === "string" ? params.condition : undefined;
  const brand = typeof params.brand === "string" ? params.brand : undefined;
  const minPrice = typeof params.minPrice === "string" ? Number(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;
  const page = typeof params.page === "string" ? Math.max(1, Number(params.page)) : 1;

  const result = await getListings({
    category,
    search,
    sortBy: sort === "newest" ? undefined : sort,
    size,
    condition,
    brand,
    minPrice: !isNaN(minPrice!) ? minPrice : undefined,
    maxPrice: !isNaN(maxPrice!) ? maxPrice : undefined,
    page,
    limit: 12,
  });

  let wishlistIds = new Set<string>();
  try {
    const { userId } = await auth();
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (user) {
        wishlistIds = await getUserWishlistIds(user.id);
      }
    }
  } catch {
    // Not signed in — default to empty set
  }

  const hasFilters =
    !!(category && category !== "all") ||
    !!search ||
    !!size ||
    !!condition ||
    !!brand ||
    !!params.minPrice ||
    !!params.maxPrice;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <p className="text-[0.66rem] tracking-[0.18em] uppercase font-semibold text-ink/45 font-montserrat">
          {result.total} {result.total === 1 ? "listing" : "listings"} found
        </p>
      </div>

      {result.listings.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
            {result.listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isWishlisted={wishlistIds.has(listing.id)}
              />
            ))}
          </div>

          <Pagination currentPage={result.page} totalPages={result.totalPages} />
        </>
      )}
    </>
  );
}

function ListingsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
      <ListingSkeleton count={8} />
    </div>
  );
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  return (
    <div className="min-h-screen bg-b8">
      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
        <div className="mb-10">
          <span className="eyebrow text-ink/45 block mb-3">Browse the marketplace</span>
          <h1 className="font-playfair text-[2.2rem] sm:text-[2.6rem] text-ink font-normal leading-tight">
            The collection
          </h1>
          <p className="text-[0.85rem] text-ink/50 mt-2 font-light">
            Discover clothes available for rent or purchase across the UK.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          <aside className="bg-white border border-line p-6 lg:sticky lg:top-24 lg:self-start max-[900px]:static">
            <Suspense fallback={null}>
              <FilterPanel />
            </Suspense>
          </aside>

          <main>
            <Suspense fallback={<ListingsGridSkeleton />}>
              <ListingsGrid searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>

      <div className="mt-16">
        <Footer columns={browseFooterColumns} />
      </div>
    </div>
  );
}
