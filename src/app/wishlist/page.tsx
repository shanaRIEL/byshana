import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserWishlist } from "@/lib/db";
import ListingCard from "@/components/listing/ListingCard";
import Footer from "@/components/footer/Footer";
import { browseFooterColumns } from "@/data";

export default async function WishlistPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    redirect("/sign-in");
  }

  const wishlist = await getUserWishlist(user.id);
  const listings = wishlist.map((w) => w.listing);

  return (
    <div className="min-h-screen bg-b8">
      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
        <div className="mb-10">
          <span className="eyebrow text-ink/45 block mb-3">Saved for later</span>
          <h1 className="font-playfair text-[2.2rem] sm:text-[2.6rem] text-ink font-normal leading-tight">
            My wishlist
          </h1>
          <p className="text-[0.66rem] tracking-[0.18em] uppercase text-ink/45 font-semibold mt-3">
            {listings.length} {listings.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-line">
            <div className="w-16 h-16 bg-sand flex items-center justify-center mb-7">
              <svg
                className="w-7 h-7 text-ink/40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
            </div>
            <h3 className="font-playfair text-[1.5rem] text-ink mb-2">
              No saved items yet
            </h3>
            <p className="text-[0.82rem] text-ink/50 font-light max-w-sm mb-8 leading-relaxed">
              Browse the marketplace and tap the heart on any piece to save it
              here for later.
            </p>
            <Link href="/browse" className="btn-ink">
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isWishlisted={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-16">
        <Footer columns={browseFooterColumns} />
      </div>
    </div>
  );
}
