import type { Metadata } from "next";
import { Great_Vibes, Montserrat, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/common/Toast";
import Navbar from "@/components/navbar/Navbar";
import "./globals.css";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Shana — UK Wardrobe Rental",
  description:
    "Rent beautiful clothes for any occasion. Buy pieces you love. Earn from your wardrobe. The UK's wardrobe rental platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html
        lang="en"
        className={`${greatVibes.variable} ${montserrat.variable} ${playfair.variable}`}
      >
        <body className={montserrat.variable}>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
