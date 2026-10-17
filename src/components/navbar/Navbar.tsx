"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

interface NavbarProps {
  showToast?: (message: string) => void;
}

const ANNOUNCEMENTS = [
  "Rent from £10/day · 1–7 day rentals",
  "Earn 90% — list your wardrobe today",
];

export default function Navbar({ showToast }: NavbarProps) {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (mobileOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    },
    [mobileOpen],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  const links = [
    { label: "Home", href: "/" },
    { label: "Browse", href: "/browse" },
    { label: "Womenswear", href: "/browse?category=women" },
    { label: "Menswear", href: "/browse?category=men" },
    { label: "How it works", href: "/how-it-works" },
    { label: "List your clothes", href: "/list" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  const iconButton =
    "p-2 text-ink/70 hover:text-ink transition-colors duration-200 cursor-pointer bg-transparent border-none flex items-center";

  return (
    <>
      <div className="bg-ink text-b8">
        <div className="flex items-center justify-center gap-10 px-6 py-[0.5rem] text-[0.6rem] sm:text-[0.65rem] font-medium tracking-[0.18em] uppercase">
          <span className="hidden sm:inline">{ANNOUNCEMENTS[0]}</span>
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline-block w-6 h-px bg-b8/40" />
            {ANNOUNCEMENTS[1]}
          </span>
        </div>
      </div>

      <nav
        className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3.5 px-6 md:px-10 bg-white border-b border-line sticky top-0 z-[1000] transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_18px_rgba(20,16,12,0.06)]" : ""
        }`}
      >
        <Link
          href="/"
          className="font-playfair text-[0.85rem] md:text-[1.15rem] tracking-[0.18em] md:tracking-[0.28em] uppercase text-ink no-underline justify-self-start whitespace-nowrap"
        >
          Your-Wardrobe
        </Link>

        <ul className="hidden lg:flex gap-8 list-none items-center">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[0.66rem] tracking-[0.18em] uppercase no-underline font-medium transition-colors duration-200 cursor-pointer hover:text-ink relative after:absolute after:left-0 after:-bottom-1.5 after:h-px after:bg-ink after:transition-all after:duration-200 ${
                  isActive(link.href)
                    ? "text-ink after:w-full"
                    : "text-ink/55 after:w-0"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex gap-1 items-center justify-self-end">
          <Link href="/browse" aria-label="Search listings" className={iconButton}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`text-[0.66rem] tracking-[0.18em] uppercase no-underline font-medium transition-colors duration-200 cursor-pointer hover:text-ink mx-2 ${
                  pathname.startsWith("/dashboard") ? "text-ink" : "text-ink/55"
                }`}
              >
                Dashboard
              </Link>
              <button
                aria-label="Notifications"
                className={iconButton}
                onClick={() => (showToast ?? fallbackToast)("Notifications coming soon")}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <UserButton
                customMenuItems={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Profile", href: "/dashboard/profile" },
                  { label: "Settings", href: "/dashboard/settings" },
                ]}
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-line hover:border-ink/40 transition-colors",
                    userButtonPopoverCard: "bg-white border border-line shadow-lg rounded-none",
                    userButtonPopoverMain: "bg-white",
                    userButtonPopoverActions: "bg-white",
                    userButtonPopoverActionButton: "text-ink/70 hover:text-ink hover:bg-sand",
                    userButtonPopoverFooter: "bg-white border-t border-line",
                  },
                }}
              />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-[0.66rem] tracking-[0.18em] uppercase font-medium text-ink/60 hover:text-ink no-underline transition-colors duration-200 px-3 py-2"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="bg-ink border border-ink text-b8 py-[0.55rem] px-[1.15rem] text-[0.64rem] tracking-[0.16em] uppercase font-semibold no-underline transition-colors duration-200 hover:bg-transparent hover:text-ink"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <div className="flex lg:hidden items-center gap-1 justify-self-end">
          <Link href="/browse" aria-label="Search listings" className={iconButton}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <button
            className="flex lg:hidden flex-col justify-center gap-[5px] cursor-pointer p-2 bg-transparent border-none z-[1001]"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className={`w-[22px] h-[1.5px] bg-ink rounded-sm transition-all duration-300 ${mobileOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`w-[22px] h-[1.5px] bg-ink rounded-sm transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`w-[22px] h-[1.5px] bg-ink rounded-sm transition-all duration-300 ${mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-[999] lg:hidden" />
      )}

      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white border-l border-line z-[1000] lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <span className="font-playfair text-[0.85rem] tracking-[0.2em] uppercase text-ink whitespace-nowrap">Your-Wardrobe</span>
          <button
            className="flex flex-col justify-center gap-[5px] cursor-pointer p-2 bg-transparent border-none"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <span className="w-[22px] h-[1.5px] bg-ink rounded-sm rotate-45 translate-y-[6.5px]" />
            <span className="w-[22px] h-[1.5px] bg-ink rounded-sm opacity-0" />
            <span className="w-[22px] h-[1.5px] bg-ink rounded-sm -rotate-45 -translate-y-[6.5px]" />
          </button>
        </div>

        <div className="flex flex-col py-4 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-6 py-3.5 text-[0.72rem] tracking-[0.18em] uppercase no-underline font-medium transition-colors duration-200 border-l-2 ${
                isActive(link.href)
                  ? "text-ink border-ink bg-sand/60"
                  : "text-ink/55 border-transparent hover:text-ink hover:bg-sand/40"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-line">
          {isSignedIn ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                className={`text-[0.72rem] tracking-[0.18em] uppercase no-underline font-medium py-2 transition-colors duration-200 ${
                  pathname.startsWith("/dashboard") ? "text-ink font-semibold" : "text-ink/55 hover:text-ink"
                }`}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3 py-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full border border-line",
                    },
                  }}
                />
                <span className="text-[0.7rem] tracking-[0.12em] uppercase text-ink/55">Account</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/sign-in"
                className="bg-transparent border border-ink text-ink py-[0.6rem] px-[1.2rem] text-[0.68rem] tracking-[0.16em] uppercase font-semibold no-underline text-center transition-colors duration-200 hover:bg-ink hover:text-b8"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="bg-ink border border-ink text-b8 py-[0.6rem] px-[1.2rem] text-[0.68rem] tracking-[0.16em] uppercase font-semibold no-underline text-center transition-colors duration-200 hover:bg-transparent hover:text-ink"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function fallbackToast(message: string) {
  const existing = document.getElementById("navbar-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "navbar-toast";
  toast.textContent = message;
  toast.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-b8 px-6 py-3 rounded-full text-sm font-medium z-[9999] transition-opacity duration-300 opacity-100";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
