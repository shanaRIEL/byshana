import Image from "next/image";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeDimensions = {
  sm: 32,
  md: 48,
  lg: 80,
  xl: 112,
};

const sizeClasses = {
  sm: "w-8 h-8 text-[0.7rem]",
  md: "w-12 h-12 text-[0.85rem]",
  lg: "w-20 h-20 text-[1.2rem]",
  xl: "w-28 h-28 text-[1.6rem]",
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserAvatar({ src, name, size = "md" }: UserAvatarProps) {
  const initials = getInitials(name);
  const sizeClass = sizeClasses[size];
  const dimension = sizeDimensions[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? "User avatar"}
        width={dimension}
        height={dimension}
        unoptimized
        className={`${sizeClass} rounded-full object-cover border-2 border-b6`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-b2 text-b8 flex items-center justify-center font-montserrat font-semibold border-2 border-b6`}
    >
      {initials}
    </div>
  );
}
