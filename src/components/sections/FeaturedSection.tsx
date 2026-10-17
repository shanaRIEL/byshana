import Link from "next/link";
import { getListings } from "@/lib/db";
import { dbListingToDisplay } from "@/types";
import ProductGrid from "@/components/cards/ProductGrid";

export default async function FeaturedSection() {
  const { listings } = await getListings({ limit: 4 });
  const featured = listings.map(dbListingToDisplay);

  return (
    <section className="bg-white py-16 lg:py-20 px-6 sm:px-10 lg:px-16 border-t border-line">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="eyebrow text-ink/45 block mb-3">New arrivals</span>
          <h2 className="font-playfair text-[2rem] sm:text-[2.4rem] font-normal text-ink leading-tight">
            Featured this week
          </h2>
          <p className="text-[0.82rem] font-light text-ink/50 mt-2">
            Curated pieces from wardrobes across the UK.
          </p>
        </div>
        <Link
          href="/browse"
          className="text-[0.66rem] tracking-[0.18em] uppercase font-semibold text-ink no-underline flex items-center gap-2 hover:gap-3 transition-all duration-200 border-b border-ink pb-1"
        >
          View all
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>

      {featured.length > 0 ? (
        <ProductGrid items={featured} />
      ) : (
        <div className="text-center py-16">
          <p className="text-ink/50 text-[0.85rem]">
            No listings yet. Be the first to list your clothes!
          </p>
        </div>
      )}
    </section>
  );
}
