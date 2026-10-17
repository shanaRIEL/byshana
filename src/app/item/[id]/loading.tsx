export default function ItemLoading() {
  return (
    <div className="px-12 max-[768px]:px-6 py-10 animate-pulse">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-3 w-12 bg-b7 rounded" />
        <div className="h-3 w-3 bg-b7 rounded" />
        <div className="h-3 w-16 bg-b7 rounded" />
        <div className="h-3 w-3 bg-b7 rounded" />
        <div className="h-3 w-20 bg-b7 rounded" />
      </div>

      <div className="grid grid-cols-2 gap-12 max-[900px]:grid-cols-1">
        <div>
          <div className="h-[480px] bg-sand" />
          <div className="flex gap-2.5 mt-3">
            <div className="w-20 h-20 bg-sand" />
            <div className="w-20 h-20 bg-sand" />
            <div className="w-20 h-20 bg-sand" />
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <div className="h-5 w-24 bg-sand" />
          <div className="h-9 w-3/4 bg-sand" />
          <div className="h-4 w-32 bg-sand" />
          <div className="flex gap-3">
            <div className="h-8 w-20 bg-sand" />
            <div className="h-8 w-28 bg-sand" />
          </div>
          <div className="h-px bg-line my-2" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-sand" />
            <div className="h-4 w-5/6 bg-sand" />
            <div className="h-4 w-2/3 bg-sand" />
          </div>
          <div className="flex gap-2 mt-2">
            <div className="h-10 w-14 bg-sand" />
            <div className="h-10 w-14 bg-sand" />
            <div className="h-10 w-14 bg-sand" />
            <div className="h-10 w-14 bg-sand" />
          </div>
          <div className="h-12 w-full bg-ink/15 mt-4" />
          <div className="h-12 w-full bg-sand" />
        </div>
      </div>
    </div>
  );
}
