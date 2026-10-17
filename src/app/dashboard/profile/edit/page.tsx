"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getProfile } from "../actions";
import type { ProfileData } from "../actions";
import ProfileForm from "@/components/profile/ProfileForm";

function EditSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-48 bg-sand mb-2" />
      <div className="h-3.5 w-64 bg-sand mb-9" />
      <div className="bg-white border border-line p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="h-2.5 w-20 bg-sand mb-2" />
              <div className="h-10 w-full bg-sand" />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="h-2.5 w-10 bg-sand mb-2" />
          <div className="h-24 w-full bg-sand" />
        </div>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    async function fetchProfile() {
      try {
        const result = await getProfile();
        if (result.success && result.data) {
          setProfile(result.data);
        } else if (clerkUser) {
          setProfile({
            id: clerkUser.id,
            clerkId: clerkUser.id,
            name: clerkUser.fullName ?? clerkUser.firstName ?? null,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            image: clerkUser.imageUrl ?? null,
            bio: null,
            phone: null,
            city: null,
            country: null,
            gender: null,
            dateOfBirth: null,
            createdAt: clerkUser.createdAt ?? new Date(),
            updatedAt: new Date(),
            emailVerified: true,
          });
        } else {
          router.push("/dashboard/profile");
        }
      } catch {
        if (clerkUser) {
          setProfile({
            id: clerkUser.id,
            clerkId: clerkUser.id,
            name: clerkUser.fullName ?? clerkUser.firstName ?? null,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            image: clerkUser.imageUrl ?? null,
            bio: null,
            phone: null,
            city: null,
            country: null,
            gender: null,
            dateOfBirth: null,
            createdAt: clerkUser.createdAt ?? new Date(),
            updatedAt: new Date(),
            emailVerified: true,
          });
        } else {
          router.push("/dashboard/profile");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isLoaded, clerkUser, router]);

  if (!isLoaded || loading) {
    return (
      <div>
        <h1 className="font-playfair text-[2rem] text-ink font-normal mb-2">
          Edit Profile
        </h1>
        <p className="text-[0.82rem] text-ink/50 font-light mb-10">
          Update your personal information and preferences.
        </p>
        <EditSkeleton />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div>
      <h1 className="font-playfair text-[2rem] text-ink font-normal mb-2">
        Edit Profile
      </h1>
      <p className="text-[0.82rem] text-ink/50 font-light mb-10">
        Update your personal information and preferences.
      </p>
      <div className="bg-white border border-line p-8">
        <ProfileForm
          initialData={{
            name: profile.name,
            bio: profile.bio,
            phone: profile.phone,
            city: profile.city,
            country: profile.country,
            gender: profile.gender,
            dateOfBirth: profile.dateOfBirth,
          }}
        />
      </div>
    </div>
  );
}
