"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createBooking,
  getBookingById,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
} from "@/lib/db";

async function resolveUserId() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  return user?.id ?? null;
}

export async function createBookingAction(input: {
  listingId: string;
  startDate: string;
  endDate: string;
}): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  try {
    const renterId = await resolveUserId();
    if (!renterId) return { success: false, error: "You must be signed in to book" };

    const booking = await createBooking({
      listingId: input.listingId,
      renterId,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    });

    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath(`/item/${input.listingId}`);
    revalidatePath("/bookings");
    revalidatePath("/dashboard/bookings");

    return { success: true, data: { id: booking.id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create booking";
    return { success: false, error: message };
  }
}

export async function cancelBookingAction(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const renterId = await resolveUserId();
    if (!renterId) return { success: false, error: "You must be signed in" };

    const booking = await getBookingById(bookingId);
    if (!booking) return { success: false, error: "Booking not found" };
    if (booking.renterId !== renterId) return { success: false, error: "Not your booking" };
    if (booking.status !== "pending") return { success: false, error: "Only pending bookings can be cancelled" };

    await updateBookingStatus(bookingId, "cancelled");
    revalidatePath("/bookings");
    revalidatePath("/dashboard/bookings");
    revalidatePath(`/item/${booking.listingId}`);

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to cancel booking";
    return { success: false, error: message };
  }
}

export async function acceptBookingAction(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const ownerId = await resolveUserId();
    if (!ownerId) return { success: false, error: "You must be signed in" };

    const booking = await getBookingById(bookingId);
    if (!booking) return { success: false, error: "Booking not found" };
    if (booking.listing.ownerId !== ownerId) return { success: false, error: "Not your listing" };
    if (booking.status !== "pending") return { success: false, error: "Only pending bookings can be accepted" };

    await updateBookingStatus(bookingId, "accepted");
    revalidatePath("/bookings");
    revalidatePath("/dashboard/bookings");
    revalidatePath(`/item/${booking.listingId}`);

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to accept booking";
    return { success: false, error: message };
  }
}

export async function rejectBookingAction(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const ownerId = await resolveUserId();
    if (!ownerId) return { success: false, error: "You must be signed in" };

    const booking = await getBookingById(bookingId);
    if (!booking) return { success: false, error: "Booking not found" };
    if (booking.listing.ownerId !== ownerId) return { success: false, error: "Not your listing" };
    if (booking.status !== "pending") return { success: false, error: "Only pending bookings can be rejected" };

    await updateBookingStatus(bookingId, "rejected");
    revalidatePath("/bookings");
    revalidatePath("/dashboard/bookings");
    revalidatePath(`/item/${booking.listingId}`);

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reject booking";
    return { success: false, error: message };
  }
}

export async function startBookingAction(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const ownerId = await resolveUserId();
    if (!ownerId) return { success: false, error: "You must be signed in" };

    const booking = await getBookingById(bookingId);
    if (!booking) return { success: false, error: "Booking not found" };
    if (booking.listing.ownerId !== ownerId) return { success: false, error: "Not your listing" };
    if (booking.status !== "accepted") return { success: false, error: "Only accepted bookings can be started" };

    await updateBookingStatus(bookingId, "active");
    revalidatePath("/bookings");
    revalidatePath("/dashboard/bookings");

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start booking";
    return { success: false, error: message };
  }
}

export async function completeBookingAction(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const ownerId = await resolveUserId();
    if (!ownerId) return { success: false, error: "You must be signed in" };

    const booking = await getBookingById(bookingId);
    if (!booking) return { success: false, error: "Booking not found" };
    if (booking.listing.ownerId !== ownerId) return { success: false, error: "Not your listing" };
    if (booking.status !== "active") return { success: false, error: "Only active bookings can be completed" };

    await updateBookingStatus(bookingId, "completed");
    revalidatePath("/bookings");
    revalidatePath("/dashboard/bookings");
    revalidatePath(`/item/${booking.listingId}`);

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to complete booking";
    return { success: false, error: message };
  }
}

export async function getUserBookingsAction() {
  try {
    const renterId = await resolveUserId();
    if (!renterId) return { success: false, error: "You must be signed in" };

    const bookings = await getUserBookings(renterId);
    return { success: true, data: bookings };
  } catch {
    return { success: false, error: "Failed to load bookings" };
  }
}

export async function getOwnerBookingsAction() {
  try {
    const ownerId = await resolveUserId();
    if (!ownerId) return { success: false, error: "You must be signed in" };

    const bookings = await getOwnerBookings(ownerId);
    return { success: true, data: bookings };
  } catch {
    return { success: false, error: "Failed to load bookings" };
  }
}
