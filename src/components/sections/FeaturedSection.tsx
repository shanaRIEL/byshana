import Link from "next/link";
import { getListings } from "@/lib/db";
import { dbListingToDisplay } from "@/types";
import ProductGrid from "@/components/cards/ProductGrid";

export default async function FeaturedSection() {
  const { listings } = await getListings({ limit: 4 });
  const featured = listings.map(dbListingToDisplay);

  return (
    <section className="py-20 px-12 max-[900px]:px-6">
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="text-[0.66rem] tracking-[0.18em] uppercase font-semibold block mb-2.5 text-accent">
            Featured
          </span>
          <h2 className="font-playfair text-[2.3rem] font-normal text-b1 leading-tight">
            Trending right now
          </h2>
        </div>
        <Link
          href="/browse"
          className="bg-b1 text-b8 border-none py-[0.72rem] px-[1.5rem] rounded-[28px] text-[0.78rem] font-medium no-underline transition-colors duration-200 hover:bg-b2"
        >
          View all listings
        </Link>
      </div>

      {featured.length > 0 ? (
        <ProductGrid items={featured} />
      ) : (
        <div className="text-center py-16">
          <p className="text-b4 text-[0.88rem]">No listings yet. Be the first to list your clothes!</p>
        </div>
      )}
    </section>
  );
}
