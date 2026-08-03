import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserReviewsReceived } from "@/lib/db";
import ReviewCard from "@/components/review/ReviewCard";
import RatingSummary from "@/components/review/RatingSummary";

export default async function DashboardReviewsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const reviews = await getUserReviewsReceived(user.id);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
  });

  return (
    <div>
      <h1 className="font-playfair text-[1.8rem] text-b1 font-normal mb-2">
        Reviews Received
      </h1>
      <p className="text-[0.88rem] text-b4 font-light mb-8">
        What renters are saying about your listed items.
      </p>

      {reviews.length > 0 && (
        <div className="bg-b8 border border-b6 rounded-[14px] p-6 mb-8">
          <RatingSummary average={avgRating} count={reviews.length} distribution={distribution} />
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-b7 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-b5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <p className="text-[0.88rem] text-b3 font-montserrat">No reviews received yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl">
          {reviews.map((review) => (
            <div key={review.id}>
              <p className="text-[0.78rem] text-b4 font-montserrat mb-2">
                on <span className="text-b3 font-medium">{review.listing?.title ?? "Listing"}</span>
              </p>
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
