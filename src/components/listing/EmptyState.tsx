import Link from "next/link";

export default function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-b7 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-b5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 className="font-playfair text-[1.3rem] text-b1 mb-2">No listings found</h3>
      <p className="text-[0.84rem] text-b4 font-montserrat max-w-sm mb-6">
        {hasFilters
          ? "Try adjusting your filters or search terms to find what you\u2019re looking for."
          : "There are no listings yet. Be the first to list an item!"}
      </p>
      {hasFilters ? (
        <Link
          href="/browse"
          className="px-6 py-2.5 bg-b1 text-b8 font-montserrat text-[0.82rem] font-semibold rounded-[10px] hover:bg-b2 transition-colors"
        >
          Clear filters
        </Link>
      ) : (
        <Link
          href="/list"
          className="px-6 py-2.5 bg-b1 text-b8 font-montserrat text-[0.82rem] font-semibold rounded-[10px] hover:bg-b2 transition-colors"
        >
          List an item
        </Link>
      )}
    </div>
  );
}
