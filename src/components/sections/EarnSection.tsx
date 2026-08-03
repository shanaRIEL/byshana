"use client";

import { useState } from "react";
import Link from "next/link";
import {
  calculatorOptions,
  defaultCalculatorPrice,
  defaultCalculatorDays,
  platformFeePercent,
} from "@/data";

const steps = [
  {
    title: "Create your listing",
    desc: "Snap a photo, set your price and choose your rental days.",
  },
  {
    title: "Get bookings",
    desc: "Users browse and book your items. You get notified instantly.",
  },
  {
    title: "Get paid",
    desc: "Once the item is returned safely, your earnings land in your account.",
  },
];

export default function EarnSection() {
  const [price, setPrice] = useState(defaultCalculatorPrice);
  const [selectedDays, setSelectedDays] = useState(defaultCalculatorDays);

  const earnings = price * selectedDays * (1 - platformFeePercent / 100);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Left */}
      <div className="bg-b1 py-20 px-14 max-[900px]:px-6 flex flex-col justify-center">
        <span className="text-[0.66rem] tracking-[0.18em] uppercase font-semibold block mb-2.5 text-b5">
          For lenders
        </span>
        <h2 className="font-playfair text-[2.1rem] font-normal text-b7 mb-4 leading-tight">
          Your wardrobe earns while you sleep
        </h2>
        <p className="text-[0.86rem] text-b5 leading-[1.8] font-light max-w-[400px] mb-8">
          Turn unused clothes into income. List once, earn repeatedly. Shana
          handles bookings, payments and protection so you don&apos;t have to.
        </p>

        <div className="flex flex-col gap-[1.1rem] mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-b6/15 text-b6 text-[0.72rem] font-semibold flex items-center justify-center shrink-0 mt-[2px]">
                {i + 1}
              </div>
              <div className="text-[0.8rem] text-b5 leading-[1.6]">
                <strong className="text-b7 block text-[0.83rem] mb-[0.12rem]">
                  {s.title}
                </strong>
                {s.desc}
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/list"
          className="bg-b8 text-b1 border-none py-[0.82rem] px-[1.9rem] rounded-[28px] text-[0.8rem] font-medium no-underline w-fit transition-colors duration-200 hover:bg-b7"
        >
          Start listing today
        </Link>
      </div>

      {/* Right */}
      <div className="bg-b7 py-20 px-14 max-[900px]:px-6 flex flex-col justify-center">
        <div className="bg-b8 rounded-[20px] p-8 border border-b6/50 mt-4">
          <span className="text-[0.68rem] font-semibold tracking-[0.08em] uppercase text-b4 mb-1.5 block">
            Daily rental price
          </span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="w-full bg-b7 border-[1.5px] border-b6 text-b1 py-[0.72rem] px-4 font-playfair text-[1.3rem] rounded-xl outline-none mb-[1.2rem] transition-colors duration-200 focus:border-b4"
          />

          <span className="text-[0.68rem] font-semibold tracking-[0.08em] uppercase text-b4 mb-1.5 block">
            Rental duration
          </span>
          <div className="grid grid-cols-3 gap-2 mb-[1.2rem]">
            {calculatorOptions.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setSelectedDays(opt.days)}
                className={`py-[0.58rem] text-center rounded-[10px] border-[1.5px] text-[0.74rem] font-medium cursor-pointer font-montserrat transition-all duration-[180ms] ${
                  selectedDays === opt.days
                    ? "bg-b2 text-b8 border-b2"
                    : "bg-b7 text-b4 border-b6 hover:border-b4"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="bg-b6 rounded-[14px] py-[1.2rem] px-[1.4rem] border border-b5">
            <span className="text-[0.66rem] font-semibold tracking-[0.1em] uppercase text-b3 mb-[0.3rem] block">
              You earn per month
            </span>
            <div className="font-playfair text-[2.5rem] text-b1">
              £{earnings.toFixed(0)}
            </div>
            <p className="text-[0.7rem] text-b4 mt-1.5 leading-[1.5]">
              Based on continuous bookings. Shana takes a{" "}
              {platformFeePercent}% platform fee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
