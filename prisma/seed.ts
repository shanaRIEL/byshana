import "dotenv/config";
import { PrismaClient, ListingStatus } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SEED_EMAIL_DOMAIN = "shana-seed.test";

interface SeedUser {
  email: string;
  name: string;
  city: string;
  country: string;
  bio: string;
}

const SEED_OWNERS: SeedUser[] = [
  {
    email: `seed-owner-1@${SEED_EMAIL_DOMAIN}`,
    name: "Amara Okafor",
    city: "London",
    country: "UK",
    bio: "Fashion enthusiast with a curated wardrobe of designer pieces.",
  },
  {
    email: `seed-owner-2@${SEED_EMAIL_DOMAIN}`,
    name: "James Whitfield",
    city: "Manchester",
    country: "UK",
    bio: "Minimalist menswear lover. Quality over quantity.",
  },
  {
    email: `seed-owner-3@${SEED_EMAIL_DOMAIN}`,
    name: "Priya Sharma",
    city: "Birmingham",
    country: "UK",
    bio: "Occasionwear specialist. Everything for weddings and events.",
  },
  {
    email: `seed-owner-4@${SEED_EMAIL_DOMAIN}`,
    name: "Sophie Chen",
    city: "Edinburgh",
    country: "UK",
    bio: "Streetwear collector. Sneakers and oversized fits.",
  },
  {
    email: `seed-owner-5@${SEED_EMAIL_DOMAIN}`,
    name: "Marcus Dean",
    city: "Bristol",
    country: "UK",
    bio: "Accessories curator. Bags, watches and statement pieces.",
  },
];

interface SeedListing {
  title: string;
  description: string;
  category: string;
  occasion: string | null;
  size: string;
  condition: string;
  brand: string | null;
  rentalPricePerDay: number;
  purchasePrice: number | null;
  deposit: number;
  location: string;
  status: ListingStatus;
  isAvailable: boolean;
  imageCount: number;
}

const SEED_LISTINGS: SeedListing[] = [
  // ─── WOMEN'S WEAR (5) ───
  {
    title: "Silk Wrap Dress",
    description: "Beautiful ivory silk wrap dress, perfect for weddings, parties or dinners. Flows beautifully and flatters all body types. Dry clean only.",
    category: "women",
    occasion: "occasionwear",
    size: "UK 10",
    condition: "like-new",
    brand: "Reformation",
    rentalPricePerDay: 22,
    purchasePrice: 75,
    deposit: 30,
    location: "London",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 3,
  },
  {
    title: "Cashmere Crew Jumper",
    description: "Soft merino-cashmere blend jumper in oatmeal. Perfect for layering in autumn or wearing alone in spring. True to size.",
    category: "women",
    occasion: null,
    size: "UK 12",
    condition: "excellent",
    brand: "Cos",
    rentalPricePerDay: 12,
    purchasePrice: 45,
    deposit: 15,
    location: "Manchester",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Linen Midi Skirt",
    description: "Relaxed linen midi skirt in warm sand tone. Effortlessly chic for brunches, work or casual outings. Elastic waist, very comfortable.",
    category: "women",
    occasion: "casual",
    size: "UK 8",
    condition: "good",
    brand: "Arket",
    rentalPricePerDay: 15,
    purchasePrice: 45,
    deposit: 20,
    location: "Leeds",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Floral Maxi Dress",
    description: "Gorgeous flowing floral maxi in warm tones. Great for festivals, garden parties or summer holidays. Light and breathable fabric.",
    category: "women",
    occasion: "casual",
    size: "UK 14",
    condition: "like-new",
    brand: "Nobody's Child",
    rentalPricePerDay: 20,
    purchasePrice: 65,
    deposit: 28,
    location: "Brighton",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 3,
  },
  {
    title: "Structured Blazer",
    description: "Chic caramel tweed blazer. Perfect for a smart-casual look, office or brunch. Lined interior, structured shoulders.",
    category: "women",
    occasion: null,
    size: "UK 10",
    condition: "good",
    brand: "Massimo Dutti",
    rentalPricePerDay: 24,
    purchasePrice: 95,
    deposit: 35,
    location: "Cambridge",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },

  // ─── MEN'S WEAR (5) ───
  {
    title: "Navy Blazer Suit",
    description: "Sharp navy two-piece suit. Great for interviews, weddings or formal dinners. Slim fit, well tailored. Comes with matching trousers.",
    category: "men",
    occasion: "occasionwear",
    size: "M",
    condition: "excellent",
    brand: "SuitSupply",
    rentalPricePerDay: 32,
    purchasePrice: 120,
    deposit: 45,
    location: "London",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 3,
  },
  {
    title: "Cream Turtleneck",
    description: "Soft ribbed turtleneck in off-white. Wardrobe essential for layering or wearing alone. Machine washable merino blend.",
    category: "men",
    occasion: null,
    size: "S",
    condition: "excellent",
    brand: "Uniqlo",
    rentalPricePerDay: 12,
    purchasePrice: 38,
    deposit: 15,
    location: "Bristol",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Brown Leather Jacket",
    description: "Premium tan leather jacket. Timeless biker silhouette. Goes with everything. Real leather, butter soft.",
    category: "men",
    occasion: "streetwear",
    size: "L",
    condition: "excellent",
    brand: "AllSaints",
    rentalPricePerDay: 28,
    purchasePrice: 150,
    deposit: 60,
    location: "London",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 3,
  },
  {
    title: "Oversized Co-ord Set",
    description: "Relaxed caramel-toned co-ord set. Oversized hoodie and joggers. Perfect for casual days or street style looks.",
    category: "men",
    occasion: "streetwear",
    size: "XL",
    condition: "good",
    brand: "ASOS Design",
    rentalPricePerDay: 18,
    purchasePrice: 55,
    deposit: 25,
    location: "Birmingham",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Linen Summer Shirt",
    description: "Breathable linen shirt in sage green. Perfect for summer events, holidays or casual Fridays. Relaxed fit.",
    category: "men",
    occasion: "casual",
    size: "M",
    condition: "like-new",
    brand: "J.Crew",
    rentalPricePerDay: 14,
    purchasePrice: 50,
    deposit: 18,
    location: "Edinburgh",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },

  // ─── OCCASION WEAR (5) ───
  {
    title: "Satin Evening Gown",
    description: "Stunning floor-length satin gown in deep burgundy. Perfect for black tie events, galas or formal occasions. Open back, fully lined.",
    category: "occasion",
    occasion: "occasionwear",
    size: "UK 8",
    condition: "like-new",
    brand: "TFNC",
    rentalPricePerDay: 50,
    purchasePrice: 180,
    deposit: 70,
    location: "Edinburgh",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 3,
  },
  {
    title: "Wedding Guest Dress",
    description: "Elegant dusty rose chiffon dress, tea-length. Perfect wedding guest outfit. Fully lined, has pockets!",
    category: "occasion",
    occasion: "occasionwear",
    size: "UK 12",
    condition: "like-new",
    brand: "Chi London",
    rentalPricePerDay: 40,
    purchasePrice: 130,
    deposit: 55,
    location: "Oxford",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 3,
  },
  {
    title: "Tuxedo Jumpsuit",
    description: "Statement black tuxedo-style jumpsuit with satin lapels. Modern alternative to a formal dress. Deep V-neck, wide leg.",
    category: "occasion",
    occasion: "occasionwear",
    size: "UK 10",
    condition: "excellent",
    brand: "Réalisation Par",
    rentalPricePerDay: 45,
    purchasePrice: 160,
    deposit: 60,
    location: "London",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Velvet Dinner Jacket",
    description: "Rich emerald velvet dinner jacket. Perfect for Christmas parties, galas or formal dinners. Satin peaked lapels.",
    category: "occasion",
    occasion: "occasionwear",
    size: "L",
    condition: "like-new",
    brand: "Ted Baker",
    rentalPricePerDay: 35,
    purchasePrice: 140,
    deposit: 50,
    location: "Glasgow",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Sequin Mini Dress",
    description: "Dazzling gold sequin mini dress. Show-stopping for New Year's Eve, birthdays or nights out. Fully lined for comfort.",
    category: "occasion",
    occasion: "occasionwear",
    size: "UK 6",
    condition: "excellent",
    brand: "Self-Portrait",
    rentalPricePerDay: 38,
    purchasePrice: 120,
    deposit: 45,
    location: "Liverpool",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 3,
  },

  // ─── STREETWEAR (5) ───
  {
    title: "Vintage Denim Jacket",
    description: "Classic vintage-wash denim jacket. Slightly oversized fit. Perfect layering piece for any season. Authentic worn-in feel.",
    category: "street",
    occasion: "streetwear",
    size: "M",
    condition: "good",
    brand: "Levi's",
    rentalPricePerDay: 16,
    purchasePrice: 60,
    deposit: 22,
    location: "Nottingham",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Cargo Track Pants",
    description: "Relaxed-fit cargo track pants in olive. Multiple pockets, elasticated cuffs. Streetwear essential.",
    category: "street",
    occasion: "streetwear",
    size: "L",
    condition: "like-new",
    brand: "Nike",
    rentalPricePerDay: 14,
    purchasePrice: 55,
    deposit: 20,
    location: "Sheffield",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Graphic Hoodie",
    description: "Oversized graphic hoodie in washed black. Heavyweight cotton, perfect for layering. Artist collaboration print.",
    category: "street",
    occasion: "streetwear",
    size: "XL",
    condition: "excellent",
    brand: "Palace",
    rentalPricePerDay: 18,
    purchasePrice: 70,
    deposit: 25,
    location: "London",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Cropped Puffer Jacket",
    description: "Quilted cropped puffer in cream. Lightweight yet warm. Great for transitional weather and street style looks.",
    category: "street",
    occasion: "streetwear",
    size: "S",
    condition: "like-new",
    brand: "H&M Premium",
    rentalPricePerDay: 15,
    purchasePrice: 50,
    deposit: 20,
    location: "Newcastle",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 3,
  },
  {
    title: "Pleated Mini Skirt Set",
    description: "Matching pleated mini skirt and cropped blazer in charcoal. Preppy streetwear vibes. Great as a set or separately.",
    category: "street",
    occasion: "streetwear",
    size: "UK 8",
    condition: "excellent",
    brand: "Monki",
    rentalPricePerDay: 16,
    purchasePrice: 48,
    deposit: 20,
    location: "Cardiff",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },

  // ─── ACCESSORIES (5) ───
  {
    title: "Tan Chelsea Boots",
    description: "Classic tan Chelsea boots. Worn twice. Genuine leather upper, rubber sole. Great for smart-casual looks.",
    category: "accessories",
    occasion: null,
    size: "UK 10",
    condition: "like-new",
    brand: "Clarks",
    rentalPricePerDay: 16,
    purchasePrice: 80,
    deposit: 30,
    location: "Glasgow",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Structured Handbag",
    description: "Chic structured top-handle bag in cognac leather. Gold hardware. Fits essentials and a small tablet.",
    category: "accessories",
    occasion: null,
    size: "One size",
    condition: "excellent",
    brand: "Coach",
    rentalPricePerDay: 22,
    purchasePrice: 90,
    deposit: 35,
    location: "Liverpool",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 3,
  },
  {
    title: "Pearl Drop Earrings",
    description: "Elegant freshwater pearl drop earrings with gold-plated hooks. Perfect for weddings, dinners or everyday elegance.",
    category: "accessories",
    occasion: null,
    size: "One size",
    condition: "like-new",
    brand: "Mejuri",
    rentalPricePerDay: 10,
    purchasePrice: 40,
    deposit: 15,
    location: "Oxford",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Silk Scarf",
    description: "Luxurious oversized silk scarf in botanical print. Wear as a shawl, headscarf or belt. Made in Italy.",
    category: "accessories",
    occasion: null,
    size: "One size",
    condition: "excellent",
    brand: "Errico Musso",
    rentalPricePerDay: 12,
    purchasePrice: 55,
    deposit: 20,
    location: "Edinburgh",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
  {
    title: "Leather Crossbody Bag",
    description: "Compact crossbody bag in black pebbled leather. Adjustable strap, multiple compartments. Perfect for nights out.",
    category: "accessories",
    occasion: null,
    size: "One size",
    condition: "good",
    brand: "Michael Kors",
    rentalPricePerDay: 18,
    purchasePrice: 75,
    deposit: 28,
    location: "Manchester",
    status: "ACTIVE",
    isAvailable: true,
    imageCount: 2,
  },
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  women: ["/seed-images/womenswear.svg", "/seed-images/womenswear-2.svg"],
  men: ["/seed-images/menswear.svg", "/seed-images/menswear-2.svg"],
  occasion: ["/seed-images/occasionwear.svg", "/seed-images/occasionwear-2.svg"],
  street: ["/seed-images/streetwear.svg", "/seed-images/streetwear-2.svg"],
  accessories: ["/seed-images/accessories.svg", "/seed-images/accessories-2.svg"],
};

function generateImageUrls(category: string, count: number): string[] {
  const images = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.women;
  return Array.from({ length: count }, (_, i) => images[i % images.length]);
}

async function cleanupSeedData() {
  console.log("Cleaning up previous seed data...");

  const seedUsers = await prisma.user.findMany({
    where: { email: { contains: SEED_EMAIL_DOMAIN } },
    select: { id: true },
  });

  if (seedUsers.length === 0) {
    console.log("  No previous seed data found.");
    return;
  }

  const seedUserIds = seedUsers.map((u) => u.id);

  const deletedImages = await prisma.listingImage.deleteMany({
    where: { listing: { ownerId: { in: seedUserIds } } },
  });
  console.log(`  Deleted ${deletedImages.count} listing images.`);

  const deletedListings = await prisma.listing.deleteMany({
    where: { ownerId: { in: seedUserIds } },
  });
  console.log(`  Deleted ${deletedListings.count} listings.`);

  const deletedUsers = await prisma.user.deleteMany({
    where: { id: { in: seedUserIds } },
  });
  console.log(`  Deleted ${deletedUsers.count} seed users.`);
}

async function createSeedUsers() {
  console.log("\nCreating seed users...");
  const users = [];

  for (const owner of SEED_OWNERS) {
    const user = await prisma.user.create({
      data: {
        email: owner.email,
        name: owner.name,
        city: owner.city,
        country: owner.country,
        bio: owner.bio,
        emailVerified: true,
        clerkId: null,
      },
    });
    console.log(`  Created user: ${user.name} (${user.email})`);
    users.push(user);
  }

  return users;
}

async function createListings(users: { id: string; name: string | null }[]) {
  console.log("\nCreating listings...");

  const allListings = [];

  for (let i = 0; i < SEED_LISTINGS.length; i++) {
    const seed = SEED_LISTINGS[i];
    const owner = users[i % users.length];

    const imageUrls = generateImageUrls(seed.category, seed.imageCount);

    const listing = await prisma.listing.create({
      data: {
        title: seed.title,
        description: seed.description,
        category: seed.category,
        occasion: seed.occasion,
        size: seed.size,
        condition: seed.condition,
        brand: seed.brand,
        rentalPricePerDay: seed.rentalPricePerDay,
        purchasePrice: seed.purchasePrice,
        deposit: seed.deposit,
        location: seed.location,
        status: seed.status,
        isAvailable: seed.isAvailable,
        isVerified: false,
        ownerId: owner.id,
        images: {
          create: imageUrls.map((url, idx) => ({
            url,
            order: idx,
          })),
        },
      },
      include: { images: true },
    });

    console.log(
      `  [${i + 1}/25] "${listing.title}" — ${seed.category} | ${seed.size} | £${seed.rentalPricePerDay}/day | ${listing.images.length} images`
    );
    allListings.push(listing);
  }

  return allListings;
}

// ═══════════════════════════════════════════════════════════════
//  PHASE B — BOOKINGS & REVIEWS
// ═══════════════════════════════════════════════════════════════

const REAL_USER_EMAIL_A = "abcdefgabriel99@gmail.com";
const REAL_USER_EMAIL_B = "maddygabriel10@gmail.com";

// Seed booking date range — used for idempotent cleanup
const SEED_BOOKING_START = new Date("2026-06-01");
const SEED_BOOKING_END = new Date("2026-10-31");

interface SeedBooking {
  listingTitle: string;
  renterEmail: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

const SEED_BOOKINGS: SeedBooking[] = [
  // ─── COMPLETED (7) — past dates ───
  {
    listingTitle: "Zara",
    renterEmail: REAL_USER_EMAIL_B,
    status: "completed",
    startDate: new Date("2026-06-01"),
    endDate: new Date("2026-06-04"),
  },
  {
    listingTitle: "Zudio dresses",
    renterEmail: REAL_USER_EMAIL_A,
    status: "completed",
    startDate: new Date("2026-06-08"),
    endDate: new Date("2026-06-11"),
  },
  {
    listingTitle: "Ravi collection dress",
    renterEmail: `seed-owner-1@${SEED_EMAIL_DOMAIN}`,
    status: "completed",
    startDate: new Date("2026-06-15"),
    endDate: new Date("2026-06-17"),
  },
  {
    listingTitle: "Shana dress",
    renterEmail: REAL_USER_EMAIL_A,
    status: "completed",
    startDate: new Date("2026-06-20"),
    endDate: new Date("2026-06-23"),
  },
  {
    listingTitle: "Zara",
    renterEmail: `seed-owner-2@${SEED_EMAIL_DOMAIN}`,
    status: "completed",
    startDate: new Date("2026-06-25"),
    endDate: new Date("2026-06-28"),
  },
  {
    listingTitle: "Zudio dresses",
    renterEmail: `seed-owner-3@${SEED_EMAIL_DOMAIN}`,
    status: "completed",
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-07-04"),
  },
  {
    listingTitle: "Ravi collection dress",
    renterEmail: `seed-owner-5@${SEED_EMAIL_DOMAIN}`,
    status: "completed",
    startDate: new Date("2026-07-05"),
    endDate: new Date("2026-07-08"),
  },

  // ─── ACTIVE (2) — current date within range ───
  {
    listingTitle: "Shana dress",
    renterEmail: `seed-owner-4@${SEED_EMAIL_DOMAIN}`,
    status: "active",
    startDate: new Date("2026-08-20"),
    endDate: new Date("2026-08-30"),
  },
  {
    listingTitle: "Zara",
    renterEmail: `seed-owner-5@${SEED_EMAIL_DOMAIN}`,
    status: "active",
    startDate: new Date("2026-08-22"),
    endDate: new Date("2026-08-28"),
  },

  // ─── ACCEPTED (2) — near-future dates ───
  {
    listingTitle: "Zudio dresses",
    renterEmail: REAL_USER_EMAIL_A,
    status: "accepted",
    startDate: new Date("2026-09-05"),
    endDate: new Date("2026-09-08"),
  },
  {
    listingTitle: "Ravi collection dress",
    renterEmail: `seed-owner-1@${SEED_EMAIL_DOMAIN}`,
    status: "accepted",
    startDate: new Date("2026-09-10"),
    endDate: new Date("2026-09-13"),
  },

  // ─── PENDING (2) — future dates ───
  {
    listingTitle: "Shana dress",
    renterEmail: `seed-owner-4@${SEED_EMAIL_DOMAIN}`,
    status: "pending",
    startDate: new Date("2026-09-15"),
    endDate: new Date("2026-09-18"),
  },
  {
    listingTitle: "Zara",
    renterEmail: `seed-owner-5@${SEED_EMAIL_DOMAIN}`,
    status: "pending",
    startDate: new Date("2026-09-20"),
    endDate: new Date("2026-09-23"),
  },

  // ─── REJECTED (2) — valid future dates ───
  {
    listingTitle: "Ravi collection dress",
    renterEmail: `seed-owner-3@${SEED_EMAIL_DOMAIN}`,
    status: "rejected",
    startDate: new Date("2026-10-01"),
    endDate: new Date("2026-10-04"),
  },
  {
    listingTitle: "Shana dress",
    renterEmail: `seed-owner-4@${SEED_EMAIL_DOMAIN}`,
    status: "rejected",
    startDate: new Date("2026-10-05"),
    endDate: new Date("2026-10-08"),
  },

  // ─── CANCELLED (2) — valid future dates ───
  {
    listingTitle: "Zara",
    renterEmail: `seed-owner-5@${SEED_EMAIL_DOMAIN}`,
    status: "cancelled",
    startDate: new Date("2026-10-10"),
    endDate: new Date("2026-10-13"),
  },
  {
    listingTitle: "Zudio dresses",
    renterEmail: REAL_USER_EMAIL_A,
    status: "cancelled",
    startDate: new Date("2026-10-15"),
    endDate: new Date("2026-10-18"),
  },
];

interface SeedReview {
  bookingIndex: number;
  rating: number;
  comment: string;
}

const SEED_REVIEWS: SeedReview[] = [
  // 2x 5-star
  { bookingIndex: 0, rating: 5, comment: "Absolutely stunning dress! Fit perfectly and got so many compliments. Would rent again." },
  { bookingIndex: 5, rating: 5, comment: "Love this piece! Fast communication and easy pickup." },
  // 2x 4-star
  { bookingIndex: 1, rating: 4, comment: "Beautiful dresses, great quality. Slightly delayed pickup but overall excellent." },
  { bookingIndex: 4, rating: 4, comment: "Great rental experience. The dress was exactly as described." },
  // 1x 3-star
  { bookingIndex: 2, rating: 3, comment: "Nice dress but the colour was slightly different from photos. Still good value." },
  // 1x 2-star
  { bookingIndex: 6, rating: 2, comment: "Dress had a small stain not shown in photos. Decent but could be better." },
  // bookingIndex 3 intentionally omitted — leaves one real-user completed booking unreviewed
];

async function cleanupPhaseBData() {
  console.log("\nCleaning up previous Phase B seed data...");

  // Delete reviews linked to seed bookings (on real listings in our date range)
  const seedBookings = await prisma.booking.findMany({
    where: {
      startDate: { gte: SEED_BOOKING_START, lte: SEED_BOOKING_END },
    },
    select: { id: true },
  });

  if (seedBookings.length === 0) {
    console.log("  No previous Phase B seed data found.");
    return;
  }

  const bookingIds = seedBookings.map((b) => b.id);

  const deletedReviews = await prisma.review.deleteMany({
    where: { bookingId: { in: bookingIds } },
  });
  console.log(`  Deleted ${deletedReviews.count} seed reviews.`);

  const deletedBookings = await prisma.booking.deleteMany({
    where: { id: { in: bookingIds } },
  });
  console.log(`  Deleted ${deletedBookings.count} seed bookings.`);
}

async function createPhaseBData() {
  console.log("\n═══════════════════════════════════════");
  console.log("  PHASE B — BOOKINGS & REVIEWS");
  console.log("═══════════════════════════════════════");

  // Resolve real users
  const realUserA = await prisma.user.findUnique({
    where: { email: REAL_USER_EMAIL_A },
    select: { id: true, name: true },
  });
  const realUserB = await prisma.user.findUnique({
    where: { email: REAL_USER_EMAIL_B },
    select: { id: true, name: true },
  });

  if (!realUserA || !realUserB) {
    console.error("  ERROR: Real Clerk users not found. Skipping Phase B.");
    return;
  }

  console.log(`  Real User A: ${realUserA.name}`);
  console.log(`  Real User B: ${realUserB.name}`);

  // Build email→id lookup for all users
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true },
  });
  const emailToId = new Map(allUsers.map((u) => [u.email, u.id]));

  // Build title→listing lookup for real-user listings
  const realListings = await prisma.listing.findMany({
    where: { ownerId: { in: [realUserA.id, realUserB.id] } },
    select: { id: true, title: true, rentalPricePerDay: true, deposit: true, ownerId: true },
  });
  const titleToListing = new Map(realListings.map((l) => [l.title, l]));

  // Also include seed listings for variety
  const seedListings = await prisma.listing.findMany({
    where: { ownerId: { notIn: [realUserA.id, realUserB.id] } },
    select: { id: true, title: true, rentalPricePerDay: true, deposit: true, ownerId: true },
  });
  for (const l of seedListings) {
    if (!titleToListing.has(l.title)) {
      titleToListing.set(l.title, l);
    }
  }

  // Create bookings
  console.log("\nCreating bookings...");
  const createdBookings: { id: string; status: string; renterId: string; listingId: string }[] = [];

  for (let i = 0; i < SEED_BOOKINGS.length; i++) {
    const seed = SEED_BOOKINGS[i];
    const renterId = emailToId.get(seed.renterEmail);
    const listing = titleToListing.get(seed.listingTitle);

    if (!renterId) {
      console.log(`  [${i + 1}] SKIP — renter not found: ${seed.renterEmail}`);
      continue;
    }
    if (!listing) {
      console.log(`  [${i + 1}] SKIP — listing not found: ${seed.listingTitle}`);
      continue;
    }
    if (renterId === listing.ownerId) {
      console.log(`  [${i + 1}] SKIP — self-booking: ${seed.listingTitle}`);
      continue;
    }

    const totalDays = Math.max(1, Math.round(
      (seed.endDate.getTime() - seed.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ));
    const rentalCost = listing.rentalPricePerDay * totalDays;
    const total = rentalCost + listing.deposit;

    const booking = await prisma.booking.create({
      data: {
        startDate: seed.startDate,
        endDate: seed.endDate,
        totalDays,
        dailyRate: listing.rentalPricePerDay,
        rentalCost,
        deposit: listing.deposit,
        total,
        status: seed.status,
        listingId: listing.id,
        renterId,
      },
    });

    console.log(
      `  [${i + 1}/14] "${seed.listingTitle}" — ${seed.status} | ${totalDays} days | £${rentalCost} + £${listing.deposit} deposit = £${total}`
    );
    createdBookings.push({ id: booking.id, status: seed.status, renterId, listingId: listing.id });
  }

  // Create reviews on completed bookings
  console.log("\nCreating reviews...");
  const completedBookings = createdBookings.filter((b) => b.status === "completed");
  let reviewCount = 0;

  for (const reviewSeed of SEED_REVIEWS) {
    if (reviewSeed.bookingIndex >= completedBookings.length) continue;
    const booking = completedBookings[reviewSeed.bookingIndex];

    // Reviewer must be the booking renter
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: booking.id },
    });
    if (existingReview) continue;

    const review = await prisma.review.create({
      data: {
        rating: reviewSeed.rating,
        comment: reviewSeed.comment,
        userId: booking.renterId,
        listingId: booking.listingId,
        bookingId: booking.id,
      },
    });

    reviewCount++;
    console.log(
      `  [${reviewCount}/7] Rating ${reviewSeed.rating} — "${reviewSeed.comment.substring(0, 50)}..."`
    );
  }

  // Summary
  const statusCounts = createdBookings.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log("\n═══════════════════════════════════════");
  console.log("  PHASE B COMPLETE");
  console.log("═══════════════════════════════════════");
  console.log(`  Bookings created: ${createdBookings.length}`);
  console.log(`  Reviews created: ${reviewCount}`);
  console.log("\n  Booking status distribution:");
  for (const [status, count] of Object.entries(statusCounts)) {
    console.log(`    ${status}: ${count}`);
  }
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  SHANA MARKETPLACE SEED");
  console.log("═══════════════════════════════════════\n");

  // ─── Phase A ───
  await cleanupSeedData();
  const users = await createSeedUsers();
  const listings = await createListings(users);

  console.log("\n───────────────────────────────────────");
  console.log("  Phase A Summary");
  console.log("───────────────────────────────────────");
  console.log(`  Users created: ${users.length}`);
  console.log(`  Listings created: ${listings.length}`);
  console.log(
    `  Images created: ${listings.reduce((sum, l) => sum + l.images.length, 0)}`
  );

  // ─── Phase B ───
  await cleanupPhaseBData();
  await createPhaseBData();

  await prisma.$disconnect();
  console.log("\nDone. Database disconnected.");
}

main().catch(async (e: any) => {
  console.error("\nSEED FAILED:", e.message);
  await prisma.$disconnect();
  process.exit(1);
});
