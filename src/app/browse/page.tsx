import { Suspense } from "react";
import Link from "next/link";
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
      <div className="flex items-center justify-between mb-6">
        <p className="text-[0.82rem] text-b4 font-montserrat">
          {result.total} {result.total === 1 ? "listing" : "listings"} found
        </p>
      </div>

      {result.listings.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <ListingSkeleton count={8} />
    </div>
  );
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  return (
    <div className="min-h-screen bg-b8">
      <div className="px-12 max-[900px]:px-6 py-10">
        <div className="bg-b2 rounded-[20px] px-10 py-10 mb-10 flex items-center justify-between max-[600px]:flex-col max-[600px]:text-center max-[600px]:gap-4">
          <div>
            <h1 className="font-playfair text-[2.2rem] text-b7 font-normal">
              Browse Shana
            </h1>
            <p className="text-[0.88rem] text-b5 mt-2 font-light">
              Discover clothes available for rent or purchase
            </p>
          </div>
          <Link
            href="/list"
            className="bg-transparent text-b6 border-[1.5px] border-b5 py-3 px-7 rounded-[14px] text-[0.82rem] font-montserrat font-medium transition-all duration-200 hover:bg-b5 hover:text-b1"
          >
            + List your clothes
          </Link>
        </div>

        <div className="grid grid-cols-[260px_1fr] gap-8 max-[900px]:grid-cols-1">
          <aside className="bg-b8 border border-b6 rounded-[16px] p-5 h-fit sticky top-6 max-[900px]:static max-[900px]:sticky max-[900px]:top-0">
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
