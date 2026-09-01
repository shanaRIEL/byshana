import Link from "next/link";
import type { FooterColumn } from "@/types";

const ACTION_MAP: Record<string, string> = {
  "browse-women": "/browse?category=women",
  "browse-men": "/browse?category=men",
  "browse-occasion": "/browse?category=occasion",
  "browse-street": "/browse?category=street",
  "browse-accessories": "/browse?category=accessories",
  browse: "/browse",
  list: "/list",
  "how-it-works": "/how-it-works",
  contact: "mailto:hello@byshana.me",
  app: "#",
  privacy: "#",
  terms: "#",
};

interface FooterProps {
  columns: FooterColumn[];
  description?: string;
}

export default function Footer({
  columns,
  description = "The UK's wardrobe rental platform. Rent, buy and earn from clothes — for everyone, everywhere.",
}: FooterProps) {
  return (
    <footer className="bg-b1 px-12 pt-14 pb-8 max-[900px]:px-8">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-12 max-[900px]:grid-cols-2">
        <div>
          <p className="font-great-vibes text-[2.2rem] text-b6 mb-0.8rem">
            Shana
          </p>
          <p className="text-[0.78rem] text-b4 leading-relaxed font-light max-w-240px">
            {description}
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="fcol">
            <h4 className="text-[0.7rem] font-semibold tracking-widest uppercase text-b5 mb-4">
              {col.title}
            </h4>
            {col.links.map((link) => {
              const href = ACTION_MAP[link.action] ?? "#";

              if (href.startsWith("mailto:")) {
                return (
                  <a
                    key={link.label}
                    href={href}
                    className="block text-[0.78rem] text-b4 no-underline mb-2 hover:text-b6 transition-colors"
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={href}
                  className="block text-[0.78rem] text-b4 no-underline mb-2 hover:text-b6 transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="border-t border-b2 pt-6 flex justify-between items-center">
        <span className="text-[0.72rem] text-b3">
          © 2026 Shana · UK Wardrobe Rental · All rights reserved
        </span>
        <span className="text-[0.66rem] tracking-widest uppercase text-b4 border border-b2 px-3.5 py-1.2 rounded-12px">
          Made in the UK
        </span>
      </div>
    </footer>
  );
}
