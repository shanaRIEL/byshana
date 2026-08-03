import Link from "next/link";
import UserAvatar from "./UserAvatar";

interface ProfileCardProps {
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
}

function formatDob(date: Date | null): string {
  if (!date) return "Not set";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfileCard({
  name,
  email,
  image,
  bio,
  phone,
  city,
  country,
  gender,
  dateOfBirth,
}: ProfileCardProps) {
  const location = [city, country].filter(Boolean).join(", ") || "Not set";

  return (
    <div className="bg-b7 border border-b6 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-playfair text-[1.4rem] text-b1 font-normal">
          Profile Details
        </h2>
        <Link
          href="/dashboard/profile/edit"
          className="bg-b2 text-b8 border-none py-2.5 px-5 rounded-xl text-[0.82rem] font-montserrat font-medium no-underline transition-colors duration-200 hover:bg-b1"
        >
          Edit Profile
        </Link>
      </div>

      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-b6">
        <UserAvatar src={image} name={name} size="lg" />
        <div>
          <p className="font-montserrat text-[1.1rem] text-b1 font-medium mb-0.5">
            {name ?? "Unnamed User"}
          </p>
          <p className="text-[0.82rem] text-b4 font-light">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ProfileField label="Bio" value={bio ?? "Not set"} />
        <ProfileField label="Phone" value={phone ?? "Not set"} />
        <ProfileField label="Location" value={location} />
        <ProfileField label="Gender" value={gender ?? "Not set"} />
        <ProfileField label="Date of Birth" value={formatDob(dateOfBirth)} />
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.72rem] text-b5 font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-[0.88rem] text-b1 font-light">{value}</p>
    </div>
  );
}
