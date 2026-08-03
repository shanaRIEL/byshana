# Shana

A production-ready UK wardrobe rental marketplace built with Next.js 16. Users can list clothing items for rent or purchase, browse available items with advanced filters, manage bookings, leave reviews, and track earnings through a personal dashboard.

## Features

### Authentication & User Management
- Clerk-based authentication (sign-up, sign-in, sign-out)
- Automatic Clerk-to-Prisma user synchronization via webhooks
- User profiles with editable bio, phone, location, and avatar

### Marketplace
- Browse published listings with responsive card grid
- Filter by category, size, condition, brand, and price range
- Full-text search across titles, descriptions, and brands
- Sort by newest or price
- URL-based filter state with pagination
- Route-level loading skeletons for instant navigation feedback

### Listing Management
- Create listings with multi-image upload (Cloudinary)
- Edit existing listings with pre-populated forms
- Delete listings with confirmation dialog and Cloudinary cleanup
- Status management (Active, Paused, Sold)
- Owner validation on all mutations

### Bookings
- Date-based rental booking with cost breakdown
- Booking lifecycle: Pending → Accepted → Active → Completed
- Renter and owner views with separate dashboards
- Cancel, accept, reject, and status transition controls

### Wishlist
- Save/unsave listings with optimistic heart toggle
- Dedicated wishlist page
- Server-side wishlist state on browse and detail pages

### Reviews & Ratings
- One review per completed booking (enforced via unique constraint)
- Star rating with interactive hover states
- Rating summary with distribution bars on listing detail
- "Write a review" prompt from completed bookings

### Dashboard
- Dynamic statistics (total listings, active rentals, earnings)
- My Listings with edit/delete actions
- Booking management (renter and owner tabs)
- Reviews received with aggregate rating display
- Profile editing

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon Serverless) |
| ORM | Prisma 7 |
| Authentication | Clerk |
| Image Storage | Cloudinary |
| Form Validation | Zod + React Hook Form |
| Webhook Verification | svix |

## Folder Structure

```
shana-app/
├── prisma/
│   ├── schema.prisma          # Database schema (12 models)
│   └── prisma.config.ts       # DATABASE_URL from env
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/        # Cloudinary image upload endpoint
│   │   │   └── webhooks/      # Clerk user sync webhook
│   │   ├── bookings/          # Renter bookings + server actions
│   │   ├── browse/            # Marketplace with filters + loading state
│   │   ├── dashboard/         # Owner dashboard (listings, bookings, reviews, profile)
│   │   ├── item/[id]/         # Listing detail page
│   │   ├── list/              # Create listing form + server actions
│   │   ├── reviews/           # User's written reviews
│   │   ├── wishlist/          # Saved listings
│   │   └── sign-in/sign-up/   # Clerk auth pages
│   ├── components/
│   │   ├── booking/           # BookingCard, BookingModal, StatusBadge, Actions
│   │   ├── dashboard/         # Sidebar, DeleteDialog, ListingsSkeleton
│   │   ├── detail/            # ItemDetailView
│   │   ├── listing/           # ListingCard, ListingForm, EditListingForm, FilterPanel
│   │   ├── review/            # ReviewCard, ReviewForm, RatingSummary
│   │   └── common/            # Toast provider
│   ├── lib/
│   │   ├── db.ts              # All Prisma queries and DB functions
│   │   ├── prisma/            # Prisma client with Neon adapter
│   │   ├── cloudinary.ts      # Cloudinary SDK wrapper
│   │   ├── validations/       # Zod schemas
│   │   └── utils.ts           # formatPrice, cn, date helpers
│   └── types/                 # TypeScript interfaces
├── .env                       # Environment variables (not committed)
└── package.json
```

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd shana-app

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Available Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Database Setup

The project uses Prisma 7 with Neon PostgreSQL via the `@prisma/adapter-neon` serverless driver.

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (visual database browser)
npx prisma studio
```

### Schema Overview

- **User** — Synced from Clerk via webhooks; holds profile data
- **Listing** — Items for rent/sale with category, size, condition, pricing
- **ListingImage** — Ordered images per listing (Cloudinary URLs)
- **Booking** — Rental reservations with date range and cost calculation
- **Review** — One per completed booking; rating + comment
- **Wishlist** — User-to-listing save relationship (unique constraint)
- **Payment, Message, Notification** — Schema defined, partially implemented

## Authentication

Clerk handles all authentication flows. The middleware protects `/dashboard/*` and `/list/*` routes.

- **Sign-up/Sign-in**: Clerk prebuilt components at `/sign-in` and `/sign-up`
- **User sync**: Webhook at `/api/webhooks/clerk` creates/updates Prisma User records
- **User button**: Custom dropdown in the navbar with links to dashboard, profile, and sign-out

## Image Storage

Images are uploaded to Cloudinary via a server-side API route at `/api/upload`.

- **Upload flow**: Client selects files → POST to `/api/upload` → Cloudinary upload → URL returned
- **Constraints**: Max 10 images, 5MB each, JPEG/PNG/WebP/HEIC formats
- **Optimization**: Automatic 1200x1600 limit with quality auto-optimization
- **Cleanup**: Deleting a listing removes associated Cloudinary images

## Marketplace Workflow

1. **Browse** (`/browse`) — View published listings with filter sidebar
2. **Filter** — Category, size, condition, brand, price range, search keyword
3. **Detail** (`/item/[id]`) — Full listing view with images, owner info, booking form
4. **Book** — Select dates, review cost breakdown, confirm booking
5. **Manage** — Track bookings in dashboard, leave reviews after completion

## Booking Flow

1. Renter selects dates on listing detail page
2. System validates availability and calculates costs (daily rate × days + deposit)
3. Booking created with `pending` status
4. Owner accepts or rejects
5. Owner marks as `active` when rental begins
6. Owner marks as `completed` when rental ends
7. Renter can leave a review on the completed booking

## Dashboard Features

- **Overview** (`/dashboard`) — Dynamic stats: total listings, active rentals, earnings
- **My Listings** (`/dashboard/listings`) — Grid view with edit/delete, status badges
- **Edit Listing** (`/dashboard/listings/edit/[id]`) — Pre-populated form with image management
- **Bookings** (`/dashboard/bookings`) — Owner's incoming booking requests with actions
- **Reviews** (`/dashboard/reviews`) — Reviews received with aggregate rating
- **Profile** (`/dashboard/profile`) — View and edit personal information

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy — Vercel auto-detects Next.js

### Environment Checklist

- [ ] `DATABASE_URL` points to a running Neon PostgreSQL instance
- [ ] Clerk application is configured with correct publishable/secret keys
- [ ] Clerk webhook endpoint is set to `https://your-domain.com/api/webhooks/clerk`
- [ ] Cloudinary account is active with upload preset configured
- [ ] `CLERK_WEBHOOK_SECRET` matches the signing secret from Clerk dashboard

## Future Improvements

- **Payments** — Stripe integration for booking payments
- **Messaging** — Real-time chat between renters and owners
- **Notifications** — In-app notification system
- **Search** — Elasticsearch or Algolia for full-text search
- **Mobile** — React Native or PWA for native experience
- **Analytics** — Listing views, conversion tracking
- **Email** — Transactional emails via Resend for booking confirmations
