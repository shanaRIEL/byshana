import { homepageHowItWorks } from "@/data";

const circleColors = ["bg-b6", "bg-b5", "bg-b4", "bg-b3"];

export default function HowItWorksStrip() {
  return (
    <section className="py-20 px-12 bg-b7 max-[900px]:px-6">
      <span className="text-[0.66rem] tracking-[0.18em] uppercase font-semibold block mb-2.5 text-b3">
        How it works
      </span>
      <h2 className="font-playfair text-[2.3rem] font-normal text-b1 mb-2.5 leading-tight">
        Simple from start to finish
      </h2>
      <p className="text-[0.86rem] text-b3 font-light leading-[1.75] max-w-[480px] mb-12">
        Rent, buy or earn — Shana works for everyone. No complicated process,
        just great clothes at great prices.
      </p>

      <div className="grid grid-cols-4 gap-[1.2rem] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {homepageHowItWorks.map((step, i) => (
          <div
            key={step.step}
            className="bg-b8 rounded-[18px] py-7 px-5.5 border border-b6/50 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(30,15,6,0.08)]"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.74rem] font-semibold mb-5 text-b1 ${circleColors[i]}`}
            >
              {step.step}
            </div>
            <h3 className="text-[0.9rem] font-semibold text-b1 mb-2">
              {step.title}
            </h3>
            <p className="text-[0.78rem] text-b3 leading-[1.7] font-light">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
