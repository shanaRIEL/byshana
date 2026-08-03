import UserAvatar from "./UserAvatar";

interface ProfileHeaderProps {
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileHeader({
  name,
  email,
  image,
  createdAt,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-6 mb-8">
      <UserAvatar src={image} name={name} size="xl" />
      <div>
        <h1 className="font-playfair text-[2rem] text-b1 font-normal mb-1">
          {name ?? "Unnamed User"}
        </h1>
        <p className="text-[0.88rem] text-b4 font-light mb-1">{email}</p>
        <p className="text-[0.78rem] text-b5 font-light">
          Member since {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
}
