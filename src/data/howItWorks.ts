import type { HowItWorksStep } from "@/types";

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: "01",
    title: "Create your free account",
    description:
      "Sign up in minutes with just your email. We verify your identity to keep everyone on Shana safe. No subscription, no hidden fees \u2014 it's completely free to join.",
    bullets: [
      "Email or social sign-up",
      "ID verification for trust & safety",
      "Set up your payment method securely",
    ],
    reversed: false,
  },
  {
    number: "02",
    title: "Browse & find your outfit",
    description:
      "Search through hundreds of real items listed by real people across the UK. Filter by gender, size, occasion, price or location. Every listing shows the daily rental price and buy-now option.",
    bullets: [
      "Filter by womenswear or menswear",
      "Choose 1\u20137 rental days",
      "See total cost before you commit",
    ],
    reversed: true,
  },
  {
    number: "03",
    title: "Rent or buy with one click",
    description:
      "Select your size and dates, see the full cost including deposit, and confirm your booking. Payment is held securely \u2014 the lender only gets paid once you confirm you've received the item.",
    bullets: [
      "Rent for 1\u20137 days at daily rate",
      "Or buy the item outright",
      "Refundable deposit protects the lender",
    ],
    reversed: false,
  },
  {
    number: "04",
    title: "Wear it, return it clean",
    description:
      "Receive the item by post or collect locally. Wear it, enjoy it. When done, return it clean within the agreed dates. Once the lender confirms return, your deposit is released back to you.",
    bullets: [
      "Post or local collection & return",
      "Return clean within agreed dates",
      "Deposit returned automatically",
    ],
    reversed: true,
  },
];

export const homepageHowItWorks = [
  {
    step: 1,
    title: "Create your account",
    description:
      "Sign up free in minutes. Verify your identity and you're ready to browse and rent.",
  },
  {
    step: 2,
    title: "Browse & choose",
    description:
      "Filter by gender, size, occasion or price. Find exactly the outfit you need.",
  },
  {
    step: 3,
    title: "Rent or buy",
    description:
      "Book for 1\u20137 days at a daily rate, or purchase outright if you fall in love with it.",
  },
  {
    step: 4,
    title: "Wear & return",
    description:
      "Receive your item, enjoy it, return it clean. Payment releases once safely confirmed.",
  },
];
