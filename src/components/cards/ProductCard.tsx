"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Listing } from "@/types";

function PlaceholderArt({ cat }: { cat: Listing["cat"] }) {
  const dress = cat === "women";
  return (
    <svg
      width="86"
      height="120"
      viewBox="0 0 78 110"
      fill="none"
      aria-hidden="true"
      className="opacity-90"
    >
      <path
        d="M29 14 L19 40 L14 100 L64 100 L59 40 L49 14 Z"
        fill={dress ? "#C9A87C" : "#A67C52"}
        stroke="#7A4A2A"
        strokeWidth="1"
      />
      <path
        d="M14 100 L9 110 L69 110 L64 100"
        fill={dress ? "#C9A87C" : "#A67C52"}
        stroke="#7A4A2A"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function ProductCard({ item }: { item: Listing }) {
  const [liked, setLiked] = useState(false);

  return (
    <Link
      href={`/item/${item.id}`}
      className="group flex flex-col bg-white cursor-pointer"
    >
      <div className="relative aspect-[3/4] bg-sand overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <PlaceholderArt cat={item.cat} />
          </div>
        )}

        {item.badge && (
          <span className="absolute top-3 left-3 bg-white/95 text-ink text-[0.55rem] font-semibold tracking-[0.14em] uppercase px-2.5 py-1">
            {item.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked((prev) => !prev);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white flex items-center justify-center cursor-pointer transition-colors duration-200 border-none p-0"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={liked ? "#14100c" : "none"}
            stroke="#14100c"
            strokeWidth="1.8"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="pt-3.5 pb-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-ink leading-snug line-clamp-2">
            {item.name}
          </h3>
          {item.rating > 0 && (
            <span className="shrink-0 flex items-center gap-1 text-[0.66rem] text-ink/50">
              <svg className="w-3 h-3 fill-ink/70" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {item.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="font-playfair text-[1.02rem] text-ink leading-none">
            £{item.price}
          </span>
          <span className="text-[0.62rem] tracking-[0.08em] uppercase text-ink/45">/ day</span>
          <span className="ml-auto text-[0.62rem] tracking-[0.08em] uppercase text-ink/40 border border-line px-1.5 py-0.5">
            {item.size}
          </span>
        </div>
      </div>
    </Link>
  );
}
