export type Category = "women" | "men" | "accessories";

export type Occasion = "occasionwear" | "streetwear" | "casual" | "accessories";

export type ClothingSize = "UK 6" | "UK 8" | "UK 10" | "UK 12" | "UK 14" | "UK 16";
export type GenericSize = "XS" | "S" | "M" | "L" | "XL";
export type ItemSize = ClothingSize | GenericSize | "One size";

export type Condition = "Like new" | "Excellent" | "Good" | "Fair";

export type FilterCategory = "all" | "women" | "men" | "occasion" | "street" | "accessories";

export type SortOption = "default" | "price-low" | "price-high" | "rating";

export type ListingStatus = "ACTIVE" | "PAUSED" | "SOLD";

export interface DbListing {
  id: string;
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
  isVerified: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: { id: string; name: string | null; image?: string | null };
  images?: { id: string; url: string; order: number }[];
  reviews?: { id?: string; rating: number; comment?: string | null; createdAt?: Date; userId?: string; bookingId?: string; user?: { id?: string; name: string | null; image?: string | null } }[];
  _count?: { reviews: number };
}

export interface Listing {
  id: string;
  name: string;
  owner: string;
  price: number;
  buyPrice: number | null;
  cat: Category;
  occasion: Occasion;
  size: ItemSize;
  rating: number;
  reviews: number;
  desc: string;
  bg: string;
  badgeBg: string;
  badgeColor: string;
  badge: string;
  deposit: number;
  location: string;
  brand: string | null;
  condition: string;
  status: ListingStatus;
  createdAt: Date;
}

export function dbListingToDisplay(db: DbListing): Listing {
  const categoryColors: Record<string, { bg: string; badgeBg: string; badgeColor: string; badge: string }> = {
    women: { bg: "#EDE0D0", badgeBg: "#E2C9A8", badgeColor: "#3A1F0D", badge: "Womenswear" },
    men: { bg: "#DDD0C4", badgeBg: "#C49A72", badgeColor: "#1E0F06", badge: "Menswear" },
    accessories: { bg: "#EDE0D0", badgeBg: "#E2C9A8", badgeColor: "#3A1F0D", badge: "Accessories" },
  };

  const occasionBadges: Record<string, string> = {
    occasionwear: "Occasionwear",
    streetwear: "Streetwear",
    casual: "Casual",
    accessories: "Accessories",
  };

  const colors = categoryColors[db.category] ?? categoryColors.women;
  const displayOccasion = (db.occasion as Occasion) || "casual";
  const avgRating = db.reviews?.length
    ? db.reviews.reduce((sum, r) => sum + r.rating, 0) / db.reviews.length
    : 0;

  return {
    id: db.id,
    name: db.title,
    owner: db.owner?.name ?? "Anonymous",
    price: db.rentalPricePerDay,
    buyPrice: db.purchasePrice,
    cat: (db.category as Category) || "women",
    occasion: displayOccasion,
    size: db.size as ItemSize,
    rating: Math.round(avgRating * 10) / 10,
    reviews: db._count?.reviews ?? db.reviews?.length ?? 0,
    desc: db.description,
    bg: colors.bg,
    badgeBg: colors.badgeBg,
    badgeColor: colors.badgeColor,
    badge: db.occasion ? (occasionBadges[db.occasion] ?? colors.badge) : colors.badge,
    deposit: db.deposit,
    location: db.location,
    brand: db.brand,
    condition: db.condition,
    status: db.status,
    createdAt: db.createdAt,
  };
}

export interface NavLink {
  label: string;
  page: string;
  filter?: string;
}

export interface TrustCard {
  title: string;
  description: string;
  icon: "shield" | "lock" | "check";
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  reversed: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  action: string;
}

export interface CalculatorOption {
  days: number;
  label: string;
}

export interface ListingFormCategory {
  value: string;
  label: string;
}

export interface ListingFormSize {
  value: string;
  label: string;
}

export interface ListingFormCondition {
  value: string;
  label: string;
}
