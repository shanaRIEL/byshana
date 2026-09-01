import Link from "next/link";

const cards = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M11 3L11 19M5 7Q11 3 17 7"
          stroke="#3A1F0D"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="5"
          y1="19"
          x2="17"
          y2="19"
          stroke="#3A1F0D"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    bg: "bg-b7",
    title: "Rent for any occasion",
    sub: "From \u00a310/day \u00b7 1\u20137 days",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M6 2h10l2 6H4L6 2z"
          stroke="#6B3A1F"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
        <rect
          x="3"
          y="8"
          width="16"
          height="12"
          rx="2"
          stroke="#6B3A1F"
          strokeWidth="1.5"
        />
        <path
          d="M9 14l2 2 4-4"
          stroke="#6B3A1F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bg: "bg-b6",
    title: "Buy items you love",
    sub: "Purchase at a fair price",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <circle
          cx="11"
          cy="8"
          r="3.5"
          stroke="#3A1F0D"
          strokeWidth="1.5"
        />
        <path
          d="M4 19c0-3.9 3.1-7 7-7s7 3.1 7 7"
          stroke="#3A1F0D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    bg: "bg-b7",
    title: "Earn from your wardrobe",
    sub: "List in minutes \u00b7 keep 90%",
  },
];

const stats = [
  { num: "\u00a310", lbl: "From/day" },
  { num: "90%", lbl: "You keep" },
  { num: "7", lbl: "Days max" },
];

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[88vh]">
      <div className="bg-b8 flex flex-col justify-center py-20 px-14 max-[900px]:px-6">
        <div className="inline-flex items-center gap-[6px] bg-b7 text-b3 text-[0.68rem] font-medium tracking-[0.1em] uppercase py-[0.32rem] px-4 rounded-[20px] mb-6 w-fit border border-b6/50">
          <span className="w-[6px] h-[6px] rounded-full bg-b4" />
          UK wardrobe rental platform
        </div>

        <div className="font-great-vibes text-[6.5rem] text-b2 leading-none mb-1.5">
          Shana
        </div>

        <p className="text-[1rem] font-light text-b3 leading-[1.85] max-w-[420px] mb-8">
          Rent beautiful clothes for any occasion.
          <br />
          <strong className="text-accent font-medium">
            Buy pieces you love. Earn from your wardrobe.
          </strong>
          <br />
          For everyone, everywhere in the UK.
        </p>

        <div className="flex gap-3.5 flex-wrap mb-8">
          <Link
            href="/browse?category=women"
            className="bg-b1 text-b8 border-none py-[0.82rem] px-[1.9rem] rounded-[28px] text-[0.8rem] font-montserrat font-medium no-underline transition-colors duration-200 hover:bg-b2"
          >
            Browse womenswear
          </Link>
          <Link
            href="/browse?category=men"
            className="bg-accent text-b8 border-none py-[0.82rem] px-[1.9rem] rounded-[28px] text-[0.8rem] font-montserrat font-medium no-underline transition-colors duration-200 hover:bg-b3"
          >
            Browse menswear
          </Link>
        </div>

        <div className="flex gap-5.5 flex-wrap">
          {[
            "Verified users",
            "Secure payments",
            "Free to join",
            "UK-wide delivery",
          ].map((t) => (
            <span
              key={t}
              className="flex items-center gap-[5px] text-[0.72rem] text-b4"
            >
              <span className="w-[5px] h-[5px] rounded-full bg-b5" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-b2 flex flex-col items-center justify-center gap-5 py-12 px-8 relative overflow-hidden max-[900px]:min-h-[400px]">
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-white/[0.03]" />
        <div className="absolute -bottom-15 -left-10 w-[220px] h-[220px] rounded-full bg-white/[0.03]" />

        {cards.map((c) => (
          <div
            key={c.title}
            className="bg-[rgba(251,247,242,0.97)] rounded-16px py-4 px-5 flex items-center gap-4 w-full max-w-[300px] z-[2] transition-transform duration-200 hover:translate-x-1"
          >
            <div
              className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}
            >
              {c.icon}
            </div>
            <div>
              <div className="text-[0.84rem] font-semibold text-b1 mb-[0.12rem]">
                {c.title}
              </div>
              <div className="text-[0.72rem] text-b4">{c.sub}</div>
            </div>
          </div>
        ))}

        <div className="flex gap-3 z-[2] w-full max-w-[300px]">
          {stats.map((s) => (
            <div
              key={s.lbl}
              className="bg-white/10 rounded-14px py-3.5 flex-1 text-center"
            >
              <div className="font-playfair text-[1.5rem] text-b7 leading-none">
                {s.num}
              </div>
              <div className="text-[0.6rem] text-b6/70 tracking-[0.08em] uppercase mt-1.5">
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
