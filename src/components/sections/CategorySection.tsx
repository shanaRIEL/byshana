import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    label: "Women",
    href: "/browse?category=women",
    image: "/images/category-women.svg",
    alt: "Satin slip dress on a hanger, womenswear collection",
  },
  {
    label: "Men",
    href: "/browse?category=men",
    image: "/images/category-men.svg",
    alt: "Tailored black blazer, menswear collection",
  },
  {
    label: "Accessories",
    href: "/browse?category=accessories",
    image: "/images/category-accessories.svg",
    alt: "Leather handbag and chelsea boot, accessories collection",
  },
];

export default function CategorySection() {
  return (
    <section className="bg-white py-16 lg:py-20 px-6 sm:px-10 lg:px-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="eyebrow text-ink/45 block mb-3">Shop by category</span>
          <h2 className="font-playfair text-[2rem] sm:text-[2.4rem] font-normal text-ink leading-tight">
            The collection
          </h2>
        </div>
        <Link
          href="/browse"
          className="text-[0.66rem] tracking-[0.18em] uppercase font-semibold text-ink no-underline flex items-center gap-2 hover:gap-3 transition-all duration-200 border-b border-ink pb-1"
        >
          View all
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="group relative block aspect-[3/4] overflow-hidden bg-sand-deep"
          >
            <Image
              src={cat.image}
              alt={cat.alt}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6 flex items-end justify-between">
              <h3 className="font-playfair text-[1.5rem] lg:text-[1.7rem] text-white leading-none">
                {cat.label}
              </h3>
              <span className="text-[0.6rem] tracking-[0.18em] uppercase font-semibold text-white/90 flex items-center gap-1.5 border-b border-white/60 pb-0.5">
                Shop now
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
