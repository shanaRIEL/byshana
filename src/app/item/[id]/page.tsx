import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getListingById, getSimilarListings, isListingWishlisted, getUserCompletedBookingForListing } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import ItemDetailView from "@/components/detail/ItemDetailView";

interface ItemPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ review?: string }>;
}

export default async function ItemPage({ params, searchParams }: ItemPageProps) {
  const { id } = await params;
  const { review } = await searchParams;

  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  let isWishlisted = false;
  let userCompletedBookingId: string | null = null;

  try {
    const { userId } = await auth();
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (user) {
        isWishlisted = await isListingWishlisted(user.id, listing.id);
        userCompletedBookingId = await getUserCompletedBookingForListing(user.id, listing.id);
      }
    }
  } catch {
    // Not signed in or error
  }

  const similar = listing.category
    ? await getSimilarListings(listing.id, listing.category, 4)
    : [];

  return (
    <ItemDetailView
      listing={listing}
      similar={similar}
      isWishlisted={isWishlisted}
      userCompletedBookingId={userCompletedBookingId}
      openReviewForm={review === "true"}
    />
  );
}
