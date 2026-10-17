"use client";

import { useState } from "react";

interface BookingTabsProps {
  tabs: { key: string; label: string; count: number }[];
  content: Record<string, React.ReactNode>;
}

export default function BookingTabs({ tabs, content }: BookingTabsProps) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");

  return (
    <div>
      <div className="flex gap-0 mb-8 border-b border-line overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-3 text-[0.64rem] font-montserrat font-semibold tracking-[0.14em] uppercase whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              active === tab.key
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 text-[0.6rem] bg-sand text-ink/60 px-1.5 py-0.5">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {content[active]}
    </div>
  );
}
