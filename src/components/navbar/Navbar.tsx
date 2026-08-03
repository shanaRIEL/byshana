"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

interface NavbarProps {
  showToast?: (message: string) => void;
}

export default function Navbar({ showToast }: NavbarProps) {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "Browse", href: "/browse" },
    { label: "Womenswear", href: "/browse?filter=women" },
    { label: "Menswear", href: "/browse?filter=men" },
    { label: "How it works", href: "/how-it-works" },
    { label: "List your clothes", href: "/list" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <nav
      className={`flex justify-between items-center py-4 px-12 bg-b8 border-b border-b6 sticky top-0 z-[1000] transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_20px_rgba(30,15,6,0.08)]" : ""}`}
    >
      <Link
        href="/"
        className="font-great-vibes text-[2.2rem] text-b2 no-underline"
      >
        Shana
      </Link>

      <ul className="hidden md:flex gap-7 list-none items-center">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-[0.78rem] tracking-widest no-underline font-normal transition-colors duration-200 cursor-pointer hover:text-b1 ${isActive(link.href) ? "text-b1 font-semibold" : "text-b3"}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex gap-3.2 items-center">
        {isSignedIn ? (
          <>
            <Link
              href="/dashboard"
              className={`text-[0.78rem] tracking-widest no-underline font-normal transition-colors duration-200 cursor-pointer hover:text-b1 ${pathname.startsWith("/dashboard") ? "text-b1 font-semibold" : "text-b3"}`}
            >
              Dashboard
            </Link>
            <button
              className="relative p-2 text-b3 hover:text-b1 transition-colors duration-200 cursor-pointer bg-transparent border-none"
              onClick={() => (showToast ?? fallbackToast)("Notifications coming soon")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <UserButton
              customMenuItems={[
                {
                  label: "Dashboard",
                  href: "/dashboard",
                },
                {
                  label: "Profile",
                  href: "/dashboard/profile",
                },
                {
                  label: "Settings",
                  href: "/dashboard/settings",
                },
              ]}
              appearance={{
                elements: {
                  avatarBox:
                    "w-9 h-9 rounded-full border-2 border-b6 hover:border-b4 transition-colors",
                  userButtonPopoverCard:
                    "bg-b8 border border-b6 shadow-lg rounded-xl",
                  userButtonPopoverMain: "bg-b8",
                  userButtonPopoverActions: "bg-b8",
                  userButtonPopoverActionButton:
                    "text-b3 hover:text-b1 hover:bg-b7",
                  userButtonPopoverFooter: "bg-b8 border-t border-b6",
                },
              }}
            />
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="bg-transparent border-[1.5px] border-b3 text-b3 py-[0.48rem] px-[1.2rem] rounded-3xl text-[0.76rem] font-montserrat font-medium no-underline transition-all duration-200 hover:bg-b3 hover:text-b8"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="bg-b2 border-none text-b8 py-[0.48rem] px-[1.3rem] rounded-3xl text-[0.76rem] font-montserrat font-medium no-underline transition-colors duration-200 hover:bg-b1"
            >
              Sign up free
            </Link>
          </>
        )}
      </div>

      <div
        className="flex md:hidden flex-col gap-[5px] cursor-pointer p-1"
        onClick={() => (showToast ?? fallbackToast)("Menu coming soon")}
      >
        <span className="w-[22px] h-[2px] bg-b2 rounded-sm" />
        <span className="w-[22px] h-[2px] bg-b2 rounded-sm" />
        <span className="w-[22px] h-[2px] bg-b2 rounded-sm" />
      </div>
    </nav>
  );
}

function fallbackToast(message: string) {
  const existing = document.getElementById("navbar-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "navbar-toast";
  toast.textContent = message;
  toast.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 bg-b2 text-b8 px-6 py-3 rounded-full text-sm font-medium z-[9999] transition-opacity duration-300 opacity-100";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
