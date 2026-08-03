"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations/profile";
import type { UpdateProfileInput } from "@/lib/validations/profile";

export interface ProfileData {
  id: string;
  clerkId: string | null;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
}

export async function getProfile(): Promise<{
  success: boolean;
  error?: string;
  data?: ProfileData;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "You must be signed in" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, data: user };
  } catch {
    return { success: false, error: "Failed to load profile" };
  }
}

export async function updateProfile(
  input: UpdateProfileInput
): Promise<{ success: boolean; error?: string; data?: ProfileData }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "You must be signed in to update your profile" };
    }

    const validated = updateProfileSchema.safeParse(input);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Invalid input";
      return { success: false, error: firstError };
    }

    const { dateOfBirth, ...rest } = validated.data;
    const dob = dateOfBirth ? new Date(dateOfBirth) : null;

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      create: {
        clerkId: userId,
        email: "",
        ...rest,
        dateOfBirth: dob,
      },
      update: {
        ...rest,
        dateOfBirth: dob,
      },
    });

    return { success: true, data: user };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
}
