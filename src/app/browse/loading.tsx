import ListingSkeleton from "@/components/listing/ListingSkeleton";

export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-b8">
      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-16 animate-pulse">
        <div className="mb-10">
          <div className="h-3 w-40 bg-sand mb-4" />
          <div className="h-9 w-56 bg-sand mb-3" />
          <div className="h-4 w-72 bg-sand" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          <aside className="bg-white border border-line p-6 h-fit">
            <div className="flex flex-col gap-6">
              <div className="flex gap-0">
                <div className="flex-1 h-10 bg-sand" />
                <div className="w-20 h-10 bg-ink/20" />
              </div>
              <div>
                <div className="h-2.5 w-16 bg-sand mb-3" />
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-7 w-16 bg-sand" />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="h-2.5 w-8 bg-sand mb-3" />
                  <div className="h-10 bg-sand" />
                </div>
                <div>
                  <div className="h-2.5 w-14 bg-sand mb-3" />
                  <div className="h-10 bg-sand" />
                </div>
              </div>
              <div>
                <div className="h-2.5 w-24 bg-sand mb-3" />
                <div className="flex items-center gap-2">
                  <div className="h-10 w-24 bg-sand" />
                  <div className="h-10 w-24 bg-sand" />
                  <div className="h-10 w-16 bg-sand" />
                </div>
              </div>
            </div>
          </aside>

          <main>
            <div className="mb-6">
              <div className="h-3 w-28 bg-sand" />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
              <ListingSkeleton count={8} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
