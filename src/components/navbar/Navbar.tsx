"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

interface NavbarProps {
  showToast?: (message: string) => void;
}

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

  return (
    <>
      <nav
        className={`flex justify-between items-center py-4 px-6 md:px-12 bg-b8 border-b border-b6 sticky top-0 z-[1000] transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_20px_rgba(30,15,6,0.08)]" : ""}`}
      >
        <Link
          href="/"
          className="font-great-vibes text-[1.8rem] md:text-[2.2rem] text-b2 no-underline"
        >
          ByShana
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
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Profile", href: "/dashboard/profile" },
                  { label: "Settings", href: "/dashboard/settings" },
                ]}
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 rounded-full border-2 border-b6 hover:border-b4 transition-colors",
                    userButtonPopoverCard: "bg-b8 border border-b6 shadow-lg rounded-xl",
                    userButtonPopoverMain: "bg-b8",
                    userButtonPopoverActions: "bg-b8",
                    userButtonPopoverActionButton: "text-b3 hover:text-b1 hover:bg-b7",
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

        <button
          className="flex md:hidden flex-col justify-center gap-[5px] cursor-pointer p-2 bg-transparent border-none z-[1001]"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className={`w-[22px] h-[2px] bg-b2 rounded-sm transition-all duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`w-[22px] h-[2px] bg-b2 rounded-sm transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-[22px] h-[2px] bg-b2 rounded-sm transition-all duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-[999] md:hidden" />
      )}

      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-b8 border-l border-b6 z-[1000] md:hidden transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-b6">
          <span className="font-great-vibes text-[1.8rem] text-b2">ByShana</span>
          <button
            className="flex flex-col justify-center gap-[5px] cursor-pointer p-2 bg-transparent border-none"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <span className="w-[22px] h-[2px] bg-b2 rounded-sm rotate-45 translate-y-[7px]" />
            <span className="w-[22px] h-[2px] bg-b2 rounded-sm opacity-0" />
            <span className="w-[22px] h-[2px] bg-b2 rounded-sm -rotate-45 -translate-y-[7px]" />
          </button>
        </div>

        <div className="flex flex-col py-4 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-6 py-3.5 text-[0.88rem] tracking-wider no-underline font-normal transition-colors duration-200 border-l-[3px] ${isActive(link.href) ? "text-b1 font-semibold border-b2 bg-b7/50" : "text-b3 border-transparent hover:text-b1 hover:bg-b7/30"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-b6">
          {isSignedIn ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                className={`text-[0.88rem] tracking-wider no-underline font-normal py-2 transition-colors duration-200 ${pathname.startsWith("/dashboard") ? "text-b1 font-semibold" : "text-b3 hover:text-b1"}`}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3 py-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full border-2 border-b6",
                    },
                  }}
                />
                <span className="text-[0.82rem] text-b4">Account</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/sign-in"
                className="bg-transparent border-[1.5px] border-b3 text-b3 py-[0.55rem] px-[1.2rem] rounded-3xl text-[0.82rem] font-montserrat font-medium no-underline text-center transition-all duration-200 hover:bg-b3 hover:text-b8"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="bg-b2 border-none text-b8 py-[0.55rem] px-[1.3rem] rounded-3xl text-[0.82rem] font-montserrat font-medium no-underline text-center transition-colors duration-200 hover:bg-b1"
              >
                Sign up free
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
    "fixed bottom-6 left-1/2 -translate-x-1/2 bg-b2 text-b8 px-6 py-3 rounded-full text-sm font-medium z-[9999] transition-opacity duration-300 opacity-100";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
