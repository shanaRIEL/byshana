import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, "Phone must be at most 20 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(100, "City must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .max(100, "Country must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  gender: z
    .string()
    .max(50, "Gender must be at most 50 characters")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
