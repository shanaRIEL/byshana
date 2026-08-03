import Link from "next/link";
import { howItWorksSteps } from "@/data";

export default function HowItWorksPageContent() {
  return (
    <div className="px-12 max-[768px]:px-6 py-12">
      <div className="text-center py-12 px-8 mb-12">
        <div className="font-great-vibes text-[4rem] text-b1 mb-2">Shana</div>
        <h1 className="font-playfair text-[2.5rem] text-b1 mb-4 font-normal">
          How Shana works
        </h1>
        <p className="text-[0.92rem] text-b4 font-light max-w-[520px] mx-auto leading-relaxed">
          From browsing to wearing, Shana makes renting and buying fashion simple, safe, and sustainable.
          Here&apos;s how it all works.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {howItWorksSteps.map((step) => (
          <div
            key={step.number}
            className="grid grid-cols-2 gap-12 items-center bg-b8 rounded-[20px] p-12 border-[0.5px] border-b6 max-[900px]:grid-cols-1"
            style={step.reversed ? { direction: "rtl" } : undefined}
          >
            <div
              className="h-[300px] rounded-2xl flex items-center justify-center bg-b7"
              style={{ direction: "ltr" }}
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-b5 opacity-60">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>

            <div style={{ direction: "ltr" }}>
              <div className="font-playfair text-[4rem] text-b6 font-normal leading-none mb-2">
                {step.number}
              </div>
              <h2 className="font-playfair text-[1.8rem] text-b1 mb-4 font-normal leading-tight">
                {step.title}
              </h2>
              <p className="text-[0.86rem] text-b3 leading-relaxed font-light mb-4">
                {step.description}
              </p>
              <ul className="flex flex-col gap-2.5 list-none">
                {step.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[0.82rem] text-b3 font-light">
                    <span className="w-[18px] h-[18px] rounded-full bg-b6 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-b3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16 py-12">
        <h2 className="font-playfair text-[2rem] text-b1 mb-4 font-normal">
          Ready to get started?
        </h2>
        <p className="text-[0.88rem] text-b4 font-light mb-8 max-w-[400px] mx-auto">
          Join thousands of people already renting and selling fashion on Shana.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/browse"
            className="bg-b1 text-b8 border-none py-3.5 px-8 rounded-[14px] text-[0.88rem] font-montserrat font-semibold tracking-[0.04em] transition-colors duration-200 hover:bg-b2"
          >
            Browse items
          </Link>
          <Link
            href="/list"
            className="bg-transparent text-accent border-[1.5px] border-accent py-3.5 px-8 rounded-[14px] text-[0.84rem] font-montserrat font-medium transition-all duration-200 hover:bg-accent hover:text-b8"
          >
            List your clothes
          </Link>
          <button className="bg-transparent text-b3 border-[1.5px] border-b5 py-3.5 px-8 rounded-[14px] text-[0.84rem] font-montserrat font-medium transition-all duration-200 hover:bg-b6 hover:text-b1">
            Sign up free
          </button>
        </div>
      </div>
    </div>
  );
}
