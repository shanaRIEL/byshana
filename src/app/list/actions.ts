"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createListing,
  getListingById,
  getListings,
  getListingsByUser,
  updateListing,
  deleteListing,
} from "@/lib/db";
import { createListingSchema } from "@/lib/validations/listing";
import type { CreateListingInput } from "@/lib/validations/listing";
import { cloudinary } from "@/lib/cloudinary";

async function resolvePrismaUser() {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (user) return user;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) return null;

  user = await prisma.user.create({
    data: {
      clerkId: userId,
      email,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      image: clerkUser.imageUrl ?? null,
      emailVerified: true,
    },
  });

  return user;
}

export async function createListingAction(
  input: CreateListingInput & { imageUrls?: string[] }
): Promise<{ success: boolean; error?: string; data?: { id: string } }> {
  try {
    const user = await resolvePrismaUser();
    if (!user) {
      return { success: false, error: "You must be signed in to create a listing" };
    }

    const validated = createListingSchema.safeParse(input);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Invalid input";
      return { success: false, error: firstError };
    }

    const listing = await createListing({
      ...validated.data,
      brand: validated.data.brand || undefined,
      occasion: validated.data.occasion || undefined,
      purchasePrice: validated.data.purchasePrice ?? null,
      ownerId: user.id,
      imageUrls: input.imageUrls,
    });

    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/list");
    revalidatePath("/dashboard");

    return { success: true, data: { id: listing.id } };
  } catch (err) {
    throw err;
  }
}

export async function getListingsAction({
  category,
  search,
  sortBy,
  page,
  limit,
  size,
  condition,
  minPrice,
  maxPrice,
}: {
  category?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  size?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
} = {}) {
  try {
    const result = await getListings({ category, search, sortBy, page, limit, size, condition, minPrice, maxPrice });
    return { success: true, data: result };
  } catch (err) {
    throw err;
  }
}

export async function getListingsByUserAction() {
  try {
    const user = await resolvePrismaUser();
    if (!user) {
      return { success: false, error: "You must be signed in" };
    }

    const listings = await getListingsByUser(user.id);
    return { success: true, data: listings };
  } catch (err) {
    throw err;
  }
}

export async function updateListingAction(
  id: string,
  data: Parameters<typeof updateListing>[1] & { removedImageIds?: string[] }
): Promise<{ success: boolean; error?: string; data?: { id: string } }> {
  try {
    const user = await resolvePrismaUser();
    if (!user) {
      return { success: false, error: "You must be signed in" };
    }

    const existing = await getListingById(id);
    if (!existing) {
      return { success: false, error: "Listing not found" };
    }
    if (existing.ownerId !== user.id) {
      return { success: false, error: "You can only edit your own listings" };
    }

    const { removedImageIds, ...updateData } = data;

    const listing = await updateListing(id, updateData);

    if (removedImageIds && removedImageIds.length > 0) {
      const removedImages = (existing.images ?? []).filter((img) =>
        removedImageIds.includes(img.id)
      );
      for (const img of removedImages) {
        try {
          const parts = img.url.split("/upload/");
          if (parts.length === 2) {
            let publicId = parts[1];
            const dotIndex = publicId.lastIndexOf(".");
            if (dotIndex > 0) {
              publicId = publicId.substring(0, dotIndex);
            }
            await cloudinary.uploader.destroy(publicId);
          }
        } catch {
          // Cloudinary deletion failed silently
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath(`/item/${id}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/listings");

    return { success: true, data: { id: listing.id } };
  } catch (err) {
    throw err;
  }
}

export async function deleteListingAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await resolvePrismaUser();
    if (!user) {
      return { success: false, error: "You must be signed in" };
    }

    const existing = await getListingById(id);
    if (!existing) {
      return { success: false, error: "Listing not found" };
    }
    if (existing.ownerId !== user.id) {
      return { success: false, error: "You can only delete your own listings" };
    }

    const imageUrls = existing.images?.map((img) => img.url) ?? [];

    await deleteListing(id);

    for (const url of imageUrls) {
      try {
        const parts = url.split("/upload/");
        if (parts.length === 2) {
          let publicId = parts[1];
          const dotIndex = publicId.lastIndexOf(".");
          if (dotIndex > 0) {
            publicId = publicId.substring(0, dotIndex);
          }
          await cloudinary.uploader.destroy(publicId);
        }
      } catch {
        // Image deletion failed silently — listing already deleted
      }
    }

    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/list");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/listings");

    return { success: true };
  } catch (err) {
    throw err;
  }
}
