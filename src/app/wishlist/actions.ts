"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlistIds,
  getUserWishlist,
} from "@/lib/db";

export async function toggleWishlistAction(
  listingId: string
): Promise<{ success: boolean; wishlisted: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, wishlisted: false, error: "You must be signed in to save items" };
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return { success: false, wishlisted: false, error: "User profile not found" };
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_listingId: { userId: user.id, listingId } },
    });

    if (existing) {
      await removeFromWishlist(user.id, listingId);
      revalidatePath("/");
      revalidatePath("/browse");
      revalidatePath("/wishlist");
      revalidatePath(`/item/${listingId}`);
      return { success: true, wishlisted: false };
    }

    await addToWishlist(user.id, listingId);
    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/wishlist");
    revalidatePath(`/item/${listingId}`);
    return { success: true, wishlisted: true };
  } catch {
    return { success: false, wishlisted: false, error: "Failed to update wishlist" };
  }
}

export async function getWishlistIdsAction(): Promise<Set<string>> {
  try {
    const { userId } = await auth();
    if (!userId) return new Set();

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return new Set();

    return getUserWishlistIds(user.id);
  } catch {
    return new Set();
  }
}

export async function getWishlistAction() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "You must be signed in" };

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return { success: false, error: "User profile not found" };

    const wishlist = await getUserWishlist(user.id);
    return { success: true, data: wishlist };
  } catch {
    return { success: false, error: "Failed to load wishlist" };
  }
}
