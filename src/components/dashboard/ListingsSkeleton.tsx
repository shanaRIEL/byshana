export default function ListingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-b8 border border-b6 rounded-[16px] overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/5] bg-b6" />
          <div className="p-4">
            <div className="h-4 bg-b6 rounded-lg w-3/4 mb-3" />
            <div className="h-3 bg-b6 rounded-lg w-1/3 mb-3" />
            <div className="h-5 bg-b6 rounded-lg w-1/2 mb-2" />
            <div className="h-3 bg-b6 rounded-lg w-1/4 mb-4" />
            <div className="flex gap-2">
              <div className="flex-1 h-8 bg-b6 rounded-lg" />
              <div className="flex-1 h-8 bg-b6 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
