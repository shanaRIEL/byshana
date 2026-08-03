"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getProfile } from "./actions";
import type { ProfileData } from "./actions";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileCard from "@/components/profile/ProfileCard";

function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-28 h-28 rounded-full bg-b6" />
        <div className="space-y-3">
          <div className="h-8 w-48 bg-b6 rounded-lg" />
          <div className="h-4 w-36 bg-b6 rounded-lg" />
          <div className="h-3 w-32 bg-b6 rounded-lg" />
        </div>
      </div>
      <div className="bg-b7 border border-b6 rounded-2xl p-8">
        <div className="h-6 w-40 bg-b6 rounded-lg mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-b6 rounded-lg mb-2" />
              <div className="h-4 w-32 bg-b6 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileError() {
  return (
    <div className="bg-b7 border border-b6 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="w-16 h-16 rounded-full bg-b6 flex items-center justify-center mb-5">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-b4"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h2 className="font-playfair text-[1.2rem] text-b1 mb-2">
        Could not load profile
      </h2>
      <p className="text-[0.82rem] text-b4 font-light max-w-sm">
        Something went wrong. Please try refreshing the page.
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
          setError(true);
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
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isLoaded, clerkUser]);

  if (!isLoaded || loading) {
    return (
      <div>
        <h1 className="font-playfair text-[1.8rem] text-b1 font-normal mb-2">
          Profile
        </h1>
        <p className="text-[0.88rem] text-b4 font-light mb-8">
          Manage your account details and preferences.
        </p>
        <ProfileSkeleton />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <h1 className="font-playfair text-[1.8rem] text-b1 font-normal mb-2">
          Profile
        </h1>
        <p className="text-[0.88rem] text-b4 font-light mb-8">
          Manage your account details and preferences.
        </p>
        <ProfileError />
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        image={profile.image}
        createdAt={profile.createdAt}
      />
      <ProfileCard
        name={profile.name}
        email={profile.email}
        image={profile.image}
        bio={profile.bio}
        phone={profile.phone}
        city={profile.city}
        country={profile.country}
        gender={profile.gender}
        dateOfBirth={profile.dateOfBirth}
      />
    </div>
  );
}
