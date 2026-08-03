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
          <div className="h-[480px] bg-b7 rounded-[20px]" />
          <div className="flex gap-3 mt-3">
            <div className="w-20 h-20 bg-b7 rounded-xl" />
            <div className="w-20 h-20 bg-b7 rounded-xl" />
            <div className="w-20 h-20 bg-b7 rounded-xl" />
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <div className="h-5 w-24 bg-b7 rounded" />
          <div className="h-8 w-3/4 bg-b7 rounded" />
          <div className="h-4 w-32 bg-b7 rounded" />
          <div className="flex gap-3">
            <div className="h-8 w-20 bg-b7 rounded" />
            <div className="h-8 w-28 bg-b7 rounded" />
          </div>
          <div className="h-px bg-b6 my-2" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-b7 rounded" />
            <div className="h-4 w-5/6 bg-b7 rounded" />
            <div className="h-4 w-2/3 bg-b7 rounded" />
          </div>
          <div className="flex gap-2 mt-2">
            <div className="h-10 w-14 bg-b7 rounded-[10px]" />
            <div className="h-10 w-14 bg-b7 rounded-[10px]" />
            <div className="h-10 w-14 bg-b7 rounded-[10px]" />
            <div className="h-10 w-14 bg-b7 rounded-[10px]" />
          </div>
          <div className="h-12 w-full bg-b7 rounded-[14px] mt-4" />
          <div className="h-12 w-full bg-b7 rounded-[14px]" />
        </div>
      </div>
    </div>
  );
}
