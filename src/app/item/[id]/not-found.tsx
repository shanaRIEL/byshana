import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-b8 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 bg-sand flex items-center justify-center mb-8">
        <span className="font-playfair text-[2.5rem] text-ink/30">404</span>
      </div>
      <h1 className="font-playfair text-[2rem] text-ink mb-3">Item not found</h1>
      <p className="text-[0.84rem] text-ink/50 font-montserrat max-w-md mb-9">
        The listing you&apos;re looking for doesn&apos;t exist, has been removed, or is no longer available.
      </p>
      <Link
        href="/browse"
        className="bg-ink text-b8 border border-ink py-3.5 px-8 rounded-none text-[0.64rem] font-montserrat font-semibold tracking-[0.16em] uppercase transition-colors duration-200 hover:bg-transparent hover:text-ink"
      >
        Browse listings
      </Link>
    </div>
  );
}
