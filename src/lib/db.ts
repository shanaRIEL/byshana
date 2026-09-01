import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { DbListing } from "@/types";

export interface CreateListingData {
  title: string;
  description: string;
  category: string;
  brand?: string;
  size: string;
  condition: string;
  rentalPricePerDay: number;
  purchasePrice?: number | null;
  deposit: number;
  location: string;
  occasion?: string;
  ownerId: string;
  imageUrls?: string[];
}

export interface UpdateListingData {
  title?: string;
  description?: string;
  category?: string;
  brand?: string;
  size?: string;
  condition?: string;
  rentalPricePerDay?: number;
  purchasePrice?: number | null;
  deposit?: number;
  location?: string;
  occasion?: string;
  status?: ListingStatus;
  images?: { id?: string; url: string; order: number }[];
}

export async function createListing(data: CreateListingData) {
  const { imageUrls, ...listingData } = data;

  const prismaData = {
    ...listingData,
    brand: listingData.brand || null,
    occasion: listingData.occasion || null,
    purchasePrice: listingData.purchasePrice ?? null,
    ...(imageUrls && imageUrls.length > 0
      ? {
          images: {
            create: imageUrls.map((url, index) => ({
              url,
              order: index,
            })),
          },
        }
      : {}),
  };

  return prisma.listing.create({
    data: prismaData,
    include: {
      owner: {
        select: { id: true, name: true, image: true },
      },
      images: { orderBy: { order: "asc" } },
      reviews: {
        select: { rating: true },
      },
    },
  });
}

export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, image: true },
      },
      images: { orderBy: { order: "asc" } },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          userId: true,
          bookingId: true,
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getListings({
  category,
  search,
  sortBy,
  page = 1,
  limit = 20,
  size,
  condition,
  brand,
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
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
} = {}): Promise<{ listings: DbListing[]; total: number; page: number; limit: number; totalPages: number }> {
  const where: Record<string, unknown> = {
    status: "ACTIVE" as ListingStatus,
    isAvailable: true,
  };

  if (category && category !== "all") {
    where.category = category;
  }

  if (size) {
    where.size = size;
  }

  if (condition) {
    where.condition = condition;
  }

  if (brand) {
    where.brand = { contains: brand, mode: "insensitive" };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Record<string, number> = {};
    if (minPrice !== undefined) priceFilter.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.lte = maxPrice;
    where.rentalPricePerDay = priceFilter;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Record<string, string> = {};
  if (sortBy === "price-low") orderBy.rentalPricePerDay = "asc";
  else if (sortBy === "price-high") orderBy.rentalPricePerDay = "desc";
  else orderBy.createdAt = "desc";

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        owner: {
          select: { id: true, name: true, image: true },
        },
        images: { orderBy: { order: "asc" }, take: 1 },
        reviews: {
          select: { rating: true },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return { listings, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getDashboardStats(ownerId: string) {
  const [totalListings, publishedListings, activeRentals, earningsResult] =
    await Promise.all([
      prisma.listing.count({ where: { ownerId } }),
      prisma.listing.count({ where: { ownerId, status: "ACTIVE" } }),
      prisma.booking.count({
        where: { listing: { ownerId }, status: "active" },
      }),
      prisma.booking.aggregate({
        where: { listing: { ownerId }, status: "completed" },
        _sum: { rentalCost: true },
      }),
    ]);

  return {
    totalListings,
    publishedListings,
    draftListings: totalListings - publishedListings,
    activeRentals,
    totalEarnings: earningsResult._sum.rentalCost ?? 0,
  };
}

export async function getListingsByUser(ownerId: string) {
  return prisma.listing.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      reviews: {
        select: { rating: true },
      },
    },
  });
}

export async function updateListing(id: string, data: UpdateListingData) {
  const { images, ...listingData } = data;

  if (images !== undefined) {
    const currentImages = await prisma.listingImage.findMany({
      where: { listingId: id },
      select: { id: true },
    });

    const currentIds = new Set(currentImages.map((img) => img.id));
    const incomingIds = new Set(images.filter((img) => img.id).map((img) => img.id!));

    const toDelete = currentImages.filter((img) => !incomingIds.has(img.id));

    await prisma.$transaction([
      ...(toDelete.length > 0
        ? [
            prisma.listingImage.deleteMany({
              where: { id: { in: toDelete.map((img) => img.id) } },
            }),
          ]
        : []),
      ...images.map((img) =>
        img.id
          ? prisma.listingImage.update({
              where: { id: img.id },
              data: { order: img.order },
            })
          : prisma.listingImage.create({
              data: { url: img.url, order: img.order, listingId: id },
            })
      ),
    ]);
  }

  return prisma.listing.update({
    where: { id },
    data: listingData,
    include: {
      owner: {
        select: { id: true, name: true, image: true },
      },
      images: { orderBy: { order: "asc" } },
      reviews: {
        select: { rating: true },
      },
    },
  });
}

export async function deleteListing(id: string) {
  return prisma.listing.delete({ where: { id } });
}

export async function getSimilarListings(listingId: string, category: string, limit = 4) {
  return prisma.listing.findMany({
    where: {
      id: { not: listingId },
      status: "ACTIVE" as ListingStatus,
      isAvailable: true,
      category,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, image: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
      reviews: { select: { rating: true } },
    },
  });
}

export async function addToWishlist(userId: string, listingId: string) {
  return prisma.wishlist.upsert({
    where: { userId_listingId: { userId, listingId } },
    create: { userId, listingId },
    update: {},
  });
}

export async function removeFromWishlist(userId: string, listingId: string) {
  return prisma.wishlist.deleteMany({
    where: { userId, listingId },
  });
}

export async function isListingWishlisted(userId: string, listingId: string) {
  const entry = await prisma.wishlist.findUnique({
    where: { userId_listingId: { userId, listingId } },
  });
  return !!entry;
}

export async function getUserWishlistIds(userId: string): Promise<Set<string>> {
  const entries = await prisma.wishlist.findMany({
    where: { userId },
    select: { listingId: true },
  });
  return new Set(entries.map((e) => e.listingId));
}

export async function getUserWishlist(userId: string) {
  return prisma.wishlist.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        include: {
          owner: { select: { id: true, name: true, image: true } },
          images: { orderBy: { order: "asc" }, take: 1 },
          reviews: { select: { rating: true } },
        },
      },
    },
  });
}

const bookingInclude = {
  listing: {
    include: {
      owner: { select: { id: true, name: true, image: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  },
  renter: { select: { id: true, name: true, image: true, email: true } },
} as const;

export async function createBooking(data: {
  listingId: string;
  renterId: string;
  startDate: Date;
  endDate: Date;
}) {
  const listing = await prisma.listing.findUnique({
    where: { id: data.listingId },
    select: { id: true, ownerId: true, rentalPricePerDay: true, deposit: true, isAvailable: true, status: true },
  });

  if (!listing) throw new Error("Listing not found");
  if (!listing.isAvailable) throw new Error("Listing is not available");
  if (listing.status !== "ACTIVE") throw new Error("Listing is not active");
  if (listing.ownerId === data.renterId) throw new Error("Cannot book your own listing");

  if (data.startDate >= data.endDate) throw new Error("End date must be after start date");
  if (data.startDate < new Date(new Date().setHours(0, 0, 0, 0))) throw new Error("Start date cannot be in the past");

  const overlapping = await prisma.booking.findFirst({
    where: {
      listingId: data.listingId,
      status: { in: ["pending", "accepted", "active"] },
      OR: [
        { startDate: { lte: data.endDate }, endDate: { gte: data.startDate } },
      ],
    },
  });

  if (overlapping) throw new Error("This listing is already booked for the selected dates");

  const totalDays = Math.max(1, Math.round(
    (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ));
  const rentalCost = listing.rentalPricePerDay * totalDays;
  const total = rentalCost + listing.deposit;

  return prisma.booking.create({
    data: {
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays,
      dailyRate: listing.rentalPricePerDay,
      rentalCost,
      deposit: listing.deposit,
      total,
      status: "pending",
      listingId: data.listingId,
      renterId: data.renterId,
    },
    include: bookingInclude,
  });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  });
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { renterId: userId },
    orderBy: { createdAt: "desc" },
    include: bookingInclude,
  });
}

export async function getOwnerBookings(userId: string) {
  return prisma.booking.findMany({
    where: { listing: { ownerId: userId } },
    orderBy: { createdAt: "desc" },
    include: bookingInclude,
  });
}

export async function updateBookingStatus(id: string, status: string) {
  return prisma.booking.update({
    where: { id },
    data: { status },
    include: bookingInclude,
  });
}

export const reviewInclude = {
  user: { select: { id: true, name: true, image: true } },
  listing: { select: { id: true, title: true } },
  booking: { select: { id: true, startDate: true, endDate: true } },
} as const;

export async function createReview(data: {
  userId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    select: { id: true, renterId: true, listingId: true, status: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.renterId !== data.userId) throw new Error("You can only review your own bookings");
  if (booking.status !== "completed") throw new Error("You can only review completed bookings");

  const existing = await prisma.review.findUnique({
    where: { bookingId: data.bookingId },
  });
  if (existing) throw new Error("You have already reviewed this booking");

  if (data.rating < 1 || data.rating > 5) throw new Error("Rating must be between 1 and 5");

  return prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment || null,
      userId: data.userId,
      listingId: booking.listingId,
      bookingId: data.bookingId,
    },
    include: reviewInclude,
  });
}

export async function updateReview(
  id: string,
  userId: string,
  data: { rating?: number; comment?: string }
) {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.userId !== userId) throw new Error("You can only edit your own reviews");

  if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  return prisma.review.update({
    where: { id },
    data: {
      ...(data.rating !== undefined ? { rating: data.rating } : {}),
      ...(data.comment !== undefined ? { comment: data.comment } : {}),
    },
    include: reviewInclude,
  });
}

export async function deleteReview(id: string, userId: string) {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.userId !== userId) throw new Error("You can only delete your own reviews");

  return prisma.review.delete({ where: { id } });
}

export async function getListingReviews(listingId: string) {
  return prisma.review.findMany({
    where: { listingId },
    orderBy: { createdAt: "desc" },
    include: reviewInclude,
  });
}

export async function getUserReviewsWritten(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: reviewInclude,
  });
}

export async function getUserReviewsReceived(userId: string) {
  return prisma.review.findMany({
    where: { listing: { ownerId: userId } },
    orderBy: { createdAt: "desc" },
    include: reviewInclude,
  });
}

export async function hasReviewedBooking(userId: string, bookingId: string) {
  const review = await prisma.review.findUnique({
    where: { bookingId },
    select: { id: true },
  });
  return !!review;
}

export async function getListingRatingSummary(listingId: string) {
  const result = await prisma.review.aggregate({
    where: { listingId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    average: result._avg.rating ?? 0,
    count: result._count.rating,
  };
}

export async function getUserCompletedBookingForListing(userId: string, listingId: string) {
  const booking = await prisma.booking.findFirst({
    where: {
      renterId: userId,
      listingId,
      status: "completed",
    },
    select: { id: true },
  });
  return booking?.id ?? null;
}
