import { z } from "zod";

export const createListingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().max(100, "Brand must be at most 100 characters").optional().or(z.literal("")),
  size: z.string().min(1, "Size is required"),
  condition: z.string().min(1, "Condition is required"),
  rentalPricePerDay: z
    .number()
    .positive("Rental price must be greater than 0")
    .max(10000, "Rental price must be at most 10,000"),
  purchasePrice: z
    .number()
    .positive("Purchase price must be greater than 0")
    .max(100000, "Purchase price must be at most 100,000")
    .optional()
    .nullable(),
  deposit: z
    .number()
    .positive("Deposit must be greater than 0")
    .max(10000, "Deposit must be at most 10,000"),
  location: z
    .string()
    .min(2, "Location is required")
    .max(100, "Location must be at most 100 characters"),
  occasion: z.string().optional().or(z.literal("")),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
