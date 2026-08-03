import { trustCards } from "@/data";

const icons: Record<string, React.ReactNode> = {
  shield: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="#3A1F0D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 2L4 6v5c0 4.4 3 7.5 7 9 4-1.5 7-4.6 7-9V6l-7-4z" />
      <path d="M8 11l2 2 4-4" />
    </svg>
  ),
  lock: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="#3A1F0D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="10" width="12" height="9" rx="2" />
      <path d="M7 10V7a4 4 0 018 0v3" />
    </svg>
  ),
  check: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="#3A1F0D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="9" />
      <path d="M8 11l2 2 4-4" />
    </svg>
  ),
};

export default function TrustSection() {
  return (
    <section className="py-20 px-12 bg-b7 max-[900px]:px-6">
      <span className="text-[0.66rem] tracking-[0.18em] uppercase font-semibold block mb-2.5 text-b3">
        Why people trust Shana
      </span>
      <h2 className="font-playfair text-[2.3rem] font-normal text-b1 mb-2.5 leading-tight">
        Safe, simple and transparent
      </h2>

      <div className="grid grid-cols-3 gap-[1.2rem] mt-12 max-[900px]:grid-cols-1">
        {trustCards.map((card) => (
          <div
            key={card.title}
            className="bg-b8 rounded-[18px] p-8 border border-b6/50 transition-transform duration-200 hover:-translate-y-[3px]"
          >
            <div className="w-12 h-12 rounded-[14px] bg-b6 flex items-center justify-center mb-5">
              {icons[card.icon]}
            </div>
            <h3 className="text-[0.92rem] font-semibold text-b1 mb-2">
              {card.title}
            </h3>
            <p className="text-[0.8rem] text-b3 leading-[1.7] font-light">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
