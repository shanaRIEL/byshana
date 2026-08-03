import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-b8 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-b7 flex items-center justify-center mb-8">
        <span className="font-playfair text-[2.5rem] text-b5">404</span>
      </div>
      <h1 className="font-playfair text-[2rem] text-b1 mb-3">Item not found</h1>
      <p className="text-[0.88rem] text-b4 font-montserrat max-w-md mb-8">
        The listing you&apos;re looking for doesn&apos;t exist, has been removed, or is no longer available.
      </p>
      <Link
        href="/browse"
        className="bg-b1 text-b8 py-3.5 px-8 rounded-[14px] text-[0.88rem] font-montserrat font-semibold transition-colors duration-200 hover:bg-b2"
      >
        Browse listings
      </Link>
    </div>
  );
}
