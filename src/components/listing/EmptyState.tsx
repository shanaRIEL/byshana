import Link from "next/link";

export default function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-sand flex items-center justify-center mb-7">
        <svg className="w-7 h-7 text-ink/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 className="font-playfair text-[1.5rem] text-ink mb-2">No listings found</h3>
      <p className="text-[0.82rem] text-ink/50 font-montserrat font-light max-w-sm mb-8 leading-relaxed">
        {hasFilters
          ? "Try adjusting your filters or search terms to find what you\u2019re looking for."
          : "There are no listings yet. Be the first to list an item!"}
      </p>
      {hasFilters ? (
        <Link
          href="/browse"
          className="btn-ink"
        >
          Clear filters
        </Link>
      ) : (
        <Link
          href="/list"
          className="btn-ink"
        >
          List an item
        </Link>
      )}
    </div>
  );
}
