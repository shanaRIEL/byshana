import type { NavLink, FooterColumn } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", page: "home" },
  { label: "Browse", page: "browse" },
  { label: "Womenswear", page: "browse", filter: "women" },
  { label: "Menswear", page: "browse", filter: "men" },
  { label: "How it works", page: "how-it-works" },
  { label: "List your clothes", page: "list" },
];

export const homeFooterColumns: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Womenswear", action: "browse-women" },
      { label: "Menswear", action: "browse-men" },
      { label: "Occasionwear", action: "browse-occasion" },
      { label: "Streetwear", action: "browse-street" },
      { label: "Accessories", action: "browse-accessories" },
    ],
  },
  {
    title: "Lenders",
    links: [
      { label: "List an item", action: "list" },
      { label: "How pricing works", action: "how-it-works" },
      { label: "Lender protection", action: "how-it-works" },
      { label: "Payouts explained", action: "how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Shana", action: "how-it-works" },
      { label: "How it works", action: "how-it-works" },
      { label: "Contact us", action: "contact" },
      { label: "Mobile app", action: "app" },
    ],
  },
];

export const browseFooterColumns: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Womenswear", action: "browse-women" },
      { label: "Menswear", action: "browse-men" },
      { label: "Occasionwear", action: "browse-occasion" },
    ],
  },
  {
    title: "Lenders",
    links: [
      { label: "List an item", action: "list" },
      { label: "How it works", action: "how-it-works" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQs", action: "how-it-works" },
      { label: "Contact", action: "contact" },
    ],
  },
];

export const howItWorksFooterColumns: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Womenswear", action: "browse-women" },
      { label: "Menswear", action: "browse-men" },
    ],
  },
  {
    title: "Lenders",
    links: [
      { label: "List an item", action: "list" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", action: "contact" },
    ],
  },
];

export const listFooterColumns: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Browse all", action: "browse" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "How it works", action: "how-it-works" },
      { label: "Contact", action: "contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", action: "privacy" },
      { label: "Terms & conditions", action: "terms" },
    ],
  },
];
