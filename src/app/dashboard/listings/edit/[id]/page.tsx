import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import EditListingForm from "@/components/listing/EditListingForm";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;

  const { userId } = await auth();
  if (!userId) notFound();

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) notFound();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!listing || listing.ownerId !== user.id) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-playfair text-[1.8rem] text-b1 font-normal mb-2">
        Edit Listing
      </h1>
      <p className="text-[0.88rem] text-b4 font-light mb-8">
        Update your listing details.
      </p>

      <div className="bg-b8 border border-b6 rounded-2xl p-8 max-w-[700px]">
        <EditListingForm
          listing={{
            id: listing.id,
            title: listing.title,
            description: listing.description,
            category: listing.category,
            brand: listing.brand ?? "",
            size: listing.size,
            condition: listing.condition,
            rentalPricePerDay: listing.rentalPricePerDay,
            purchasePrice: listing.purchasePrice,
            deposit: listing.deposit,
            location: listing.location,
            occasion: listing.occasion ?? "",
            status: listing.status,
            isAvailable: listing.isAvailable,
            images: listing.images.map((img) => ({
              id: img.id,
              url: img.url,
              order: img.order,
            })),
          }}
        />
      </div>
    </div>
  );
}
