"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`/browse?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router, searchParams]
  );

  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-[10px] text-[0.78rem] font-montserrat font-medium border border-b6 text-b4 hover:border-b4 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 py-2 text-[0.78rem] text-b5 font-montserrat">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`min-w-[36px] h-9 rounded-[10px] text-[0.78rem] font-montserrat font-medium border transition-colors cursor-pointer ${
              p === currentPage
                ? "bg-b1 text-b8 border-b1"
                : "bg-transparent text-b4 border-b6 hover:border-b4"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-[10px] text-[0.78rem] font-montserrat font-medium border border-b6 text-b4 hover:border-b4 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Next
      </button>
    </nav>
  );
}
