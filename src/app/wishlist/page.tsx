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
      <div className="px-12 max-[900px]:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-playfair text-[2rem] text-b1 mb-2">My Wishlist</h1>
          <p className="text-[0.84rem] text-b4 font-montserrat">
            {listings.length} {listings.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-b7 flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-b5"
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
            <h3 className="font-playfair text-[1.3rem] text-b1 mb-2">
              No saved items yet
            </h3>
            <p className="text-[0.84rem] text-b4 font-montserrat max-w-sm mb-6">
              Browse the marketplace and tap the heart icon to save items you love.
            </p>
            <Link
              href="/browse"
              className="px-6 py-2.5 bg-b1 text-b8 font-montserrat text-[0.82rem] font-semibold rounded-[10px] hover:bg-b2 transition-colors"
            >
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
