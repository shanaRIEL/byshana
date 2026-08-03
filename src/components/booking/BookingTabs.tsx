"use client";

import { useState } from "react";

interface BookingTabsProps {
  tabs: { key: string; label: string; count: number }[];
  children: (activeTab: string) => React.ReactNode;
}

export default function BookingTabs({ tabs, children }: BookingTabsProps) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-b6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2.5 text-[0.82rem] font-montserrat font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              active === tab.key
                ? "border-b1 text-b1"
                : "border-transparent text-b4 hover:text-b1"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 text-[0.7rem] bg-b7 text-b4 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}
