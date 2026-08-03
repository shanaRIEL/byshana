import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserReviewsWritten } from "@/lib/db";
import ReviewCard from "@/components/review/ReviewCard";
import Footer from "@/components/footer/Footer";
import { browseFooterColumns } from "@/data";

export default async function MyReviewsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const reviews = await getUserReviewsWritten(user.id);

  return (
    <div className="min-h-screen bg-b8">
      <div className="px-12 max-[900px]:px-6 py-10">
        <h1 className="font-playfair text-[2rem] text-b1 mb-2">My Reviews</h1>
        <p className="text-[0.84rem] text-b4 font-montserrat mb-8">
          Reviews you&apos;ve left on rented items.
        </p>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-b7 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-b5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <p className="text-[0.88rem] text-b3 font-montserrat mb-1">No reviews yet</p>
            <p className="text-[0.78rem] text-b5 font-montserrat">
              <Link href="/bookings" className="underline hover:text-b3">Complete a booking</Link> to leave a review.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl">
            {reviews.map((review) => (
              <div key={review.id}>
                <Link
                  href={`/item/${review.listingId}`}
                  className="text-[0.78rem] text-b4 font-montserrat hover:text-b2 mb-2 inline-block"
                >
                  {review.listing?.title ?? "Listing"}
                </Link>
                <ReviewCard review={review} />
              </div>
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
