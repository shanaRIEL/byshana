interface RatingSummaryProps {
  average: number;
  count: number;
  distribution?: Record<number, number>;
}

export default function RatingSummary({ average, count, distribution }: RatingSummaryProps) {
  if (count === 0) return null;

  const maxCount = distribution ? Math.max(...Object.values(distribution), 1) : 1;

  return (
    <div className="flex items-start gap-6 max-[600px]:flex-col max-[600px]:items-center">
      <div className="text-center">
        <p className="font-playfair text-[3rem] text-b1 leading-none">{average.toFixed(1)}</p>
        <div className="flex items-center gap-0.5 mt-2 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.round(average) ? "fill-warm" : "fill-b6"}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-[0.75rem] text-b5 font-montserrat mt-1">
          {count} {count === 1 ? "review" : "reviews"}
        </p>
      </div>

      {distribution && (
        <div className="flex-1 flex flex-col gap-1.5 min-w-[160px]">
          {[5, 4, 3, 2, 1].map((stars) => {
            const value = distribution[stars] ?? 0;
            const pct = count > 0 ? (value / maxCount) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-[0.72rem] text-b4 font-montserrat w-3 text-right">{stars}</span>
                <svg className="w-3 h-3 fill-warm shrink-0" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 h-1.5 bg-b7 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warm rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[0.68rem] text-b5 font-montserrat w-6 text-right">{value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
