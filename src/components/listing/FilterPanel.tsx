"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { listingSizes, listingConditions } from "@/data";

const categories = [
  { value: "all", label: "All" },
  { value: "women", label: "Womenswear" },
  { value: "men", label: "Menswear" },
  { value: "occasion", label: "Occasionwear" },
  { value: "street", label: "Streetwear" },
  { value: "accessories", label: "Accessories" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low \u2192 High" },
  { value: "price-high", label: "Price: High \u2192 Low" },
];

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const applyParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/browse?${params.toString()}`);
    },
    [router, searchParams]
  );

  const applyPriceRange = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    params.delete("page");
    router.push(`/browse?${params.toString()}`);
  }, [router, searchParams, minPrice, maxPrice]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      applyParams("search", search.trim());
    },
    [search, applyParams]
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/browse");
  }, [router]);

  const activeCategory = searchParams.get("category") ?? "all";
  const activeSort = searchParams.get("sort") ?? "newest";
  const activeSize = searchParams.get("size") ?? "";
  const activeCondition = searchParams.get("condition") ?? "";
  const activeBrand = searchParams.get("brand") ?? "";

  const hasActiveFilters =
    activeCategory !== "all" ||
    !!searchParams.get("search") ||
    !!activeSize ||
    !!activeCondition ||
    !!activeBrand ||
    !!searchParams.get("minPrice") ||
    !!searchParams.get("maxPrice");

  const inputClasses =
    "py-2.5 px-3 border border-line rounded-none font-montserrat text-[0.78rem] text-ink bg-white outline-none transition-colors duration-200 focus:border-ink/40 w-full";
  const labelClasses =
    "text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-ink/50 font-montserrat";

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex gap-0">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or brand..."
          className={`${inputClasses} flex-1`}
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-ink text-b8 border border-ink font-montserrat text-[0.64rem] font-semibold tracking-[0.14em] uppercase hover:bg-transparent hover:text-ink transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      <div>
        <p className={labelClasses}>Category</p>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => applyParams("category", c.value)}
              className={`px-3 py-1.5 rounded-none text-[0.68rem] font-montserrat font-medium tracking-[0.06em] uppercase border transition-colors cursor-pointer ${
                activeCategory === c.value
                  ? "bg-ink text-b8 border-ink"
                  : "bg-transparent text-ink/55 border-line hover:border-ink/40 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={labelClasses}>Brand</p>
        <input
          type="text"
          value={activeBrand}
          onChange={(e) => applyParams("brand", e.target.value)}
          placeholder="e.g. Zara, H&M"
          className={`${inputClasses} mt-2.5`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className={labelClasses}>Size</p>
          <select
            value={activeSize}
            onChange={(e) => applyParams("size", e.target.value)}
            className={`${inputClasses} mt-2.5`}
          >
            <option value="">All sizes</option>
            {listingSizes.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className={labelClasses}>Condition</p>
          <select
            value={activeCondition}
            onChange={(e) => applyParams("condition", e.target.value)}
            className={`${inputClasses} mt-2.5`}
          >
            <option value="">Any condition</option>
            {listingConditions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className={labelClasses}>Price range (£/day)</p>
        <div className="flex items-center gap-2 mt-2.5">
          <input
            type="number"
            min="0"
            step="1"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className={`${inputClasses} w-24`}
          />
          <span className="text-ink/35 text-[0.75rem]">—</span>
          <input
            type="number"
            min="0"
            step="1"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className={`${inputClasses} w-24`}
          />
          <button
            type="button"
            onClick={applyPriceRange}
            className="px-3 py-2.5 bg-white text-ink/60 border border-line text-[0.64rem] font-montserrat font-semibold tracking-[0.12em] uppercase hover:border-ink/40 hover:text-ink transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>

      <div>
        <p className={labelClasses}>Sort by</p>
        <select
          value={activeSort}
          onChange={(e) => applyParams("sort", e.target.value)}
          className={`${inputClasses} mt-2.5`}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 border border-line text-[0.64rem] font-montserrat font-semibold tracking-[0.14em] uppercase text-ink/55 hover:border-ink/40 hover:text-ink transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
