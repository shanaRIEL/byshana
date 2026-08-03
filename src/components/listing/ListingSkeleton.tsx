export default function ListingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-b8 rounded-[16px] border border-b6 overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/5] bg-b7" />

          <div className="flex flex-col gap-2.5 p-4">
            <div className="h-4 bg-b7 rounded-[6px] w-3/4" />
            <div className="h-3 bg-b7 rounded-[6px] w-1/2" />

            <div className="flex gap-1.5">
              <div className="h-5 bg-b7 rounded-full w-16" />
              <div className="h-5 bg-b7 rounded-full w-10" />
              <div className="h-5 bg-b7 rounded-full w-14" />
            </div>

            <div className="pt-2 border-t border-b6/50 flex items-end justify-between">
              <div className="h-5 bg-b7 rounded-[6px] w-20" />
              <div className="h-3 bg-b7 rounded-[6px] w-16" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
