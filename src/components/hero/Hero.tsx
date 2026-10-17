import Link from "next/link";
import Image from "next/image";

const trustPoints = ["Verified users", "Secure payments", "Free to join", "UK-wide"];

export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] min-h-[74vh] lg:min-h-[82vh]">
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 lg:py-20 animate-fade-up">
          <span className="eyebrow text-ink/50 mb-6">New collection · UK wardrobe rental</span>

          <h1 className="font-playfair text-[2.9rem] sm:text-[4rem] lg:text-[4.6rem] leading-[1.02] text-ink font-normal mb-6 max-w-[13ch]">
            Elevate your
            <br />
            everyday wardrobe
          </h1>

          <div className="w-10 h-px bg-ink/30 mb-6" />

          <p className="text-[0.95rem] font-light text-ink/65 leading-[1.9] max-w-[430px] mb-9">
            Rent beautiful clothes for any occasion. Buy pieces you love. Earn
            from your wardrobe — for everyone, everywhere in the UK.
          </p>

          <div className="flex gap-3.5 flex-wrap mb-10">
            <Link href="/browse" className="btn-ink">
              Shop now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/list" className="btn-outline">
              List your clothes
            </Link>
          </div>

          <div className="flex gap-6 flex-wrap">
            {trustPoints.map((t) => (
              <span key={t} className="flex items-center gap-2 text-[0.68rem] tracking-[0.1em] uppercase text-ink/45">
                <span className="w-[3px] h-[3px] rounded-full bg-ink/40" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-full bg-sand-deep overflow-hidden">
          <Image
            src="/images/hero-editorial.svg"
            alt="Editorial still life of a belted trench coat and leather handbag from the ByShana collection"
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute bottom-5 right-5 md:bottom-8 md:right-10 bg-white/90 backdrop-blur-sm px-5 py-3">
            <span className="eyebrow text-ink/45 block mb-1">From</span>
            <span className="font-playfair text-[1.6rem] text-ink leading-none">£10</span>
            <span className="text-[0.62rem] tracking-[0.14em] uppercase text-ink/50 ml-1.5">/ day</span>
          </div>
        </div>
      </div>
    </section>
  );
}
