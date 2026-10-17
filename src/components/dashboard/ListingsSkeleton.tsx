export default function ListingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-line overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/5] bg-sand" />
          <div className="p-4">
            <div className="h-3.5 bg-sand w-3/4 mb-3" />
            <div className="h-3 bg-sand w-1/3 mb-3" />
            <div className="h-4 bg-sand w-1/2 mb-3" />
            <div className="h-2.5 bg-sand w-1/4 mb-5" />
            <div className="flex gap-2">
              <div className="flex-1 h-8 bg-sand" />
              <div className="flex-1 h-8 bg-sand" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
