import type {
  ListingFormCategory,
  ListingFormSize,
  ListingFormCondition,
} from "@/types";

export const listingCategories: ListingFormCategory[] = [
  { value: "women", label: "Womenswear" },
  { value: "men", label: "Menswear" },
  { value: "occasion", label: "Occasionwear" },
  { value: "street", label: "Streetwear" },
  { value: "accessories", label: "Accessories" },
];

export const listingSizes: ListingFormSize[] = [
  { value: "UK 6", label: "UK 6" },
  { value: "UK 8", label: "UK 8" },
  { value: "UK 10", label: "UK 10" },
  { value: "UK 12", label: "UK 12" },
  { value: "UK 14", label: "UK 14" },
  { value: "UK 16", label: "UK 16" },
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
];

export const listingConditions: ListingFormCondition[] = [
  { value: "like-new", label: "Like new" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];
