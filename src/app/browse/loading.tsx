import ListingSkeleton from "@/components/listing/ListingSkeleton";

export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-b8">
      <div className="px-12 max-[900px]:px-6 py-10">
        <div className="bg-b2 rounded-[20px] px-10 py-10 mb-10 flex items-center justify-between max-[600px]:flex-col max-[600px]:text-center max-[600px]:gap-4">
          <div>
            <div className="h-9 w-52 bg-b3/30 rounded-lg mb-2 animate-pulse" />
            <div className="h-4 w-72 bg-b3/20 rounded-lg animate-pulse" />
          </div>
          <div className="h-11 w-40 bg-b5/30 rounded-[14px] animate-pulse" />
        </div>

        <div className="grid grid-cols-[260px_1fr] gap-8 max-[900px]:grid-cols-1">
          <aside className="bg-b8 border border-b6 rounded-[16px] p-5 h-fit sticky top-6 max-[900px]:static">
            <div className="flex flex-col gap-5">
              <div className="flex gap-2">
                <div className="flex-1 h-9 bg-b7 rounded-[10px] animate-pulse" />
                <div className="w-16 h-9 bg-b1 rounded-[10px] animate-pulse" />
              </div>
              <div>
                <div className="h-2.5 w-16 bg-b6 rounded mb-2 animate-pulse" />
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-7 w-16 bg-b7 rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="h-2.5 w-8 bg-b6 rounded mb-2 animate-pulse" />
                  <div className="h-9 bg-b7 rounded-[10px] animate-pulse" />
                </div>
                <div>
                  <div className="h-2.5 w-14 bg-b6 rounded mb-2 animate-pulse" />
                  <div className="h-9 bg-b7 rounded-[10px] animate-pulse" />
                </div>
              </div>
              <div>
                <div className="h-2.5 w-24 bg-b6 rounded mb-2 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-9 w-24 bg-b7 rounded-[10px] animate-pulse" />
                  <div className="h-9 w-24 bg-b7 rounded-[10px] animate-pulse" />
                  <div className="h-9 w-14 bg-b7 rounded-[10px] animate-pulse" />
                </div>
              </div>
            </div>
          </aside>

          <main>
            <div className="flex items-center justify-between mb-6">
              <div className="h-3.5 w-28 bg-b6 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <ListingSkeleton count={8} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
