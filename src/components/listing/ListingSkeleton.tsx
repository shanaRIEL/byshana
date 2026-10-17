export default function ListingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col bg-white border border-line overflow-hidden animate-pulse">
          <div className="aspect-[3/4] bg-sand" />

          <div className="flex flex-col gap-2.5 pt-3.5 pb-1 px-0.5">
            <div className="h-3 bg-sand w-3/4" />
            <div className="flex items-center gap-2">
              <div className="h-4 bg-sand w-16" />
              <div className="h-3 bg-sand w-10" />
              <div className="h-4 bg-sand w-12 ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
