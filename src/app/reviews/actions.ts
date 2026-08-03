"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  createReview,
  updateReview,
  deleteReview,
  getUserReviewsWritten,
  getUserReviewsReceived,
  hasReviewedBooking,
} from "@/lib/db";

async function resolvePrismaUser() {
  const { userId } = await auth();
  if (!userId) return null;
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
    if (!primaryEmail) return null;
    user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        image: clerkUser.imageUrl || null,
      },
      create: {
        clerkId: userId,
        email: primaryEmail,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        image: clerkUser.imageUrl || null,
      },
    });
  }
  return user;
}

export async function createReviewAction(data: {
  bookingId: string;
  rating: number;
  comment?: string;
}) {
  const user = await resolvePrismaUser();
  if (!user) return { success: false, error: "You must be signed in" };

  try {
    await createReview({
      userId: user.id,
      bookingId: data.bookingId,
      rating: data.rating,
      comment: data.comment,
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create review" };
  }
}

export async function updateReviewAction(
  id: string,
  data: { rating?: number; comment?: string }
) {
  const user = await resolvePrismaUser();
  if (!user) return { success: false, error: "You must be signed in" };

  try {
    await updateReview(id, user.id, data);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update review" };
  }
}

export async function deleteReviewAction(id: string) {
  const user = await resolvePrismaUser();
  if (!user) return { success: false, error: "You must be signed in" };

  try {
    await deleteReview(id, user.id);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete review" };
  }
}

export async function getUserReviewsWrittenAction() {
  const user = await resolvePrismaUser();
  if (!user) return [];
  return getUserReviewsWritten(user.id);
}

export async function getUserReviewsReceivedAction() {
  const user = await resolvePrismaUser();
  if (!user) return [];
  return getUserReviewsReceived(user.id);
}

export async function hasReviewedBookingAction(bookingId: string) {
  const user = await resolvePrismaUser();
  if (!user) return false;
  return hasReviewedBooking(user.id, bookingId);
}
