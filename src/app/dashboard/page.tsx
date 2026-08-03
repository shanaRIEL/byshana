import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/lib/db";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const stats = await getDashboardStats(user.id);
  const firstName = user.name?.split(" ")[0] ?? "there";

  const cards = [
    {
      label: "My Listings",
      value: stats.totalListings.toString(),
      href: "/dashboard/listings",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      ),
    },
    {
      label: "Active Rentals",
      value: stats.activeRentals.toString(),
      href: "/dashboard/bookings",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: "Earnings",
      value: `\u00A3${stats.totalEarnings.toFixed(2)}`,
      href: "/dashboard/listings",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: "Messages",
      value: "Coming Soon",
      href: "#",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-playfair text-[2rem] text-b1 font-normal mb-2">
          Welcome back, {firstName}
        </h1>
        <p className="text-[0.88rem] text-b4 font-light">
          Here&apos;s what&apos;s happening with your wardrobe.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-b7 border border-b6 rounded-2xl p-6 no-underline transition-all duration-200 hover:shadow-[0_4px_20px_rgba(30,15,6,0.06)] hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-b4">{card.icon}</span>
            </div>
            <p className="font-playfair text-[1.6rem] text-b1 font-normal mb-1">
              {card.value}
            </p>
            <p className="text-[0.78rem] text-b4 font-light tracking-wide">
              {card.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
