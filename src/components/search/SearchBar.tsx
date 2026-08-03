import Link from "next/link";

const segments = [
  { label: "Category", value: "All clothing" },
  { label: "Occasion", value: "Any occasion" },
  { label: "Size", value: "Any size" },
  { label: "Location", value: "Anywhere in UK" },
];

export default function SearchBar() {
  return (
    <section className="bg-b8 py-[1.6rem] px-12 border-b border-b6/50">
      <div className="flex bg-b8 border-[1.5px] border-b5 rounded-[50px] overflow-hidden max-w-[820px] mx-auto">
        {segments.map((s) => (
          <div
            key={s.label}
            className="flex flex-col py-[0.65rem] px-[1.3rem] flex-1 border-r border-b6 last:border-r-0 cursor-pointer transition-colors duration-200 hover:bg-b7"
          >
            <span className="text-[0.6rem] font-semibold tracking-[0.08em] uppercase text-b2 mb-[0.12rem]">
              {s.label}
            </span>
            <span className="text-[0.78rem] text-b4">{s.value}</span>
          </div>
        ))}

        <Link
          href="/browse"
          className="bg-b2 border-none text-b8 py-[0.55rem] px-6 my-[0.35rem] rounded-[40px] text-[0.78rem] font-montserrat font-medium whitespace-nowrap transition-colors duration-200 hover:bg-b1 no-underline self-center"
        >
          Search
        </Link>
      </div>
    </section>
  );
}
