const benefits = [
  {
    title: "Rent from £10/day",
    sub: "1–7 day rentals, UK-wide",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.2 3.6L17 8l-3.8 1.4L12 13l-1.2-3.6L7 8l3.8-1.4z" />
        <path d="M5 15l.7 2.1L8 18l-2.3.8L5 21l-.7-2.2L2 18l2.3-.9z" />
        <path d="M18 14l.6 1.7L20 16.4l-1.4.6L18 19l-.6-2-1.4-.6 1.4-.7z" />
      </svg>
    ),
  },
  {
    title: "Verified members",
    sub: "ID-checked community",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 4.4-2.9 7.6-7 9-4.1-1.4-7-4.6-7-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Secure payments",
    sub: "Protected by Stripe",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 018 0v3" />
      </svg>
    ),
  },
  {
    title: "Earn 90%",
    sub: "You keep the majority",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2-1.1 2-2.5 2-2.5.9-2.5 2 1.1 2 2.5 2 2.5-.9 2.5-2" />
      </svg>
    ),
  },
];

export default function TrustSection() {
  return (
    <section className="bg-white border-y border-line">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 sm:px-10 lg:px-16">
        {benefits.map((b, i) => (
          <div
            key={b.title}
            className={[
              "flex items-center gap-4 py-7 lg:py-8 lg:px-8",
              i > 0 ? "border-t border-line sm:border-t-0" : "",
              i % 2 === 1 ? "sm:border-l sm:border-line" : "",
              i >= 2 ? "sm:border-t sm:border-line lg:border-t-0" : "",
              i === 2 ? "lg:border-l lg:border-line" : "",
              i === 0 ? "lg:pl-0" : "",
              i === 3 ? "lg:pr-0" : "",
            ].join(" ")}
          >
            <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center text-ink shrink-0">
              {b.icon}
            </div>
            <div>
              <div className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-ink mb-[0.15rem]">
                {b.title}
              </div>
              <div className="text-[0.72rem] font-light text-ink/50">{b.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
