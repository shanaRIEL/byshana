"use client";

const filters = [
  { key: "all", label: "All" },
  { key: "women", label: "Womenswear" },
  { key: "men", label: "Menswear" },
  { key: "occasion", label: "Occasionwear" },
  { key: "street", label: "Streetwear" },
  { key: "accessories", label: "Accessories" },
] as const;

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex gap-[0.8rem] mb-8 flex-wrap items-center">
      <span className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-b4 mr-[0.5rem]">
        Filter
      </span>
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`px-[1.1rem] py-[0.45rem] rounded-[20px] text-[0.76rem] font-medium cursor-pointer font-montserrat transition-all duration-[0.18s] border-[1.5px] ${
            activeFilter === f.key
              ? "bg-b2 text-b8 border-b2"
              : "bg-transparent text-b4 border-b6 hover:border-b3 hover:text-b3"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
