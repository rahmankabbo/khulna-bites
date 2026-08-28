# Khulna Bites

**Everything happening in Khulna, in one place.**

A local media and discovery platform for Khulna, Bangladesh — news, offers,
events with booking, and a Business With Us channel with inquiry management.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS · PostgreSQL · Prisma**.

---

## What's inside

| Area | What it does |
|---|---|
| **Home** | Editorial hero, latest + trending news, live offers, upcoming events, business CTA |
| **News** | Photo-card articles, search, category filter, detail pages with related stories and optional “Read Full Article →” external link |
| **Offers** | Category-filtered live deals (Food / Cafe / Fashion / Shopping / Services / Other), expiry-aware (expired offers hide automatically), detail pages with terms and claim CTAs |
| **Events** | Upcoming/past events, detail pages with **Book Now** — external booking URL *or* built-in booking form (name, phone, email, tickets) with capacity checks |
| **Business With Us** | Service overview + inquiry form stored in the database |
| **Admin** | Password-protected dashboard: stats overview, full CRUD for news/offers/events, publish/feature/active toggles, booking management, inquiry inbox |

---

## 1. Install dependencies

You need **Node.js 18.18+** (or 20+) installed. Then, in the project folder:

```bash
npm install
```

## 2. Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` in a text editor. For local development the defaults work as-is —
you only need to change them if you picked a different database password in the
next step.

## 3. Set up PostgreSQL

Pick **one** of these two options.

### Option A — Docker (easiest)

If you have Docker installed:

```bash
docker compose up -d
```

That's it — a PostgreSQL 16 database called `khulna_bites` now runs on
`localhost:5432` with the user/password that match the default `DATABASE_URL`
in `.env.example`.

### Option B — Local PostgreSQL install

1. Install PostgreSQL from https://www.postgresql.org/download/ (any 14+ version).
2. Open the `psql` console (on Windows: “SQL Shell (psql)”; on macOS/Linux: `sudo -u postgres psql`).
3. Create a user and database:

```sql
CREATE USER khulna WITH PASSWORD 'khulna_dev_password';
CREATE DATABASE khulna_bites OWNER khulna;
```

> If you choose a different password, update `DATABASE_URL` in `.env` to match.
> The format is: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

## 4. Create the database tables

```bash
npm run db:push
```

This reads `prisma/schema.prisma` and creates all tables. (When the project
matures, use `npm run db:migrate` instead to keep a migration history.)

## 5. Load the demo content

```bash
npm run db:seed
```

This creates the first admin account plus realistic sample Khulna content:
6 news articles, 6 offers (one intentionally expired), 6 events (one draft),
3 bookings and 3 business inquiries — so the site looks complete immediately.
Seeding wipes existing data first, so don't re-run it once you have real content.

## 6. Start the development server

```bash
npm run dev
```

Open http://localhost:3000

## 7. Access the admin dashboard

Go to http://localhost:3000/admin and sign in with the seeded account:

- **Email:** `admin@khulnabites.com`
- **Password:** `khulna123`

(These come from `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` in your `.env` at
seed time. Change the password before deploying anywhere real.)

## 8. Create your first admin account

The seed script already creates one (step 5). To change its credentials, edit
`ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` in `.env` **before** running
`npm run db:seed` again on a fresh database.

## 9. Build for production

```bash
npm run build
npm run start
```

## 10. Project structure

```
khulna-bites/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home
│   ├── news/                   # News list + [slug] article page
│   ├── offers/                 # Offers list + [slug] detail page
│   ├── events/                 # Events list + [slug] detail (booking)
│   ├── business/               # Business With Us + inquiry form
│   ├── actions.ts              # Public server actions (booking, inquiry)
│   └── admin/
│       ├── login/              # Admin sign-in
│       ├── actions.ts          # Admin server actions (auth + all CRUD)
│       └── (dashboard)/        # Protected pages (sidebar layout)
│           ├── page.tsx        # Overview stats
│           ├── news/           # News list, new, [id]/edit
│           ├── offers/         # Offers list, new, [id]/edit
│           ├── events/         # Events list, new, [id]/edit, [id]/bookings
│           └── inquiries/      # Business inquiry inbox
├── components/                 # Public UI (cards, header, forms, filters)
│   └── admin/                  # Admin UI (sidebar, editor forms, row actions)
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── auth.ts                 # JWT session cookie (jose) + getAdmin()
│   ├── uploads.ts              # Cover image uploads → /public/uploads
│   └── utils.ts                # slugify, dates, offer/event helpers
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Demo content
├── public/
│   ├── images/                 # Demo cover images
│   └── uploads/                # User-uploaded covers (gitignored)
├── middleware.ts               # Protects /admin/* routes
├── scripts/generate-assets.py  # Regenerates logo crops + demo covers
├── docker-compose.yml          # Optional one-command PostgreSQL
└── .env.example                # Documented environment variables
```

---

## How content flows

- **Publish content:** Admin → News/Offers/Events → *New* → fill the form →
  upload a cover image → save. Published items appear on the public site
  immediately (public pages revalidate every 60 seconds).
- **Offers expire themselves:** the public offers page only shows offers that
  are `active` **and** whose `expiryDate` hasn't passed.
- **Event booking:** if an event has an external `bookingUrl`, “Book Now” links
  there. Otherwise a built-in form stores bookings in the database (status:
  pending/confirmed/cancelled), with a capacity check. View them per event in
  the admin. Online payment is intentionally not included — the `Booking` model
  is ready for a `paymentStatus` field later.
- **Business inquiries:** the Business With Us form stores submissions; admins
  triage them in the inbox (read/unread, new/contacted/closed, delete).

## Security notes

- Admin routes are protected twice: `middleware.ts` (JWT cookie check at the
  edge) and the dashboard layout (re-validates against the database).
- Passwords are hashed with bcrypt; sessions are signed JWTs (jose) in
  httpOnly cookies; secrets live only in `.env` (never committed).

## Bengali content

The font stack includes Noto Sans Bengali and everything is UTF-8 — you can
write Bangla titles, excerpts and body text in the admin and they will render
correctly.

## Notes for deployment

- Set `DATABASE_URL`, `AUTH_SECRET` (run `openssl rand -base64 32`) and
  `NEXT_PUBLIC_SITE_URL` as environment variables on your host.
- Uploaded images are stored on the local disk under `public/uploads` — on
  serverless platforms (Vercel etc.) the filesystem is ephemeral, so swap
  `lib/uploads.ts` for object storage (S3/R2/Uploadthing) before going live.
- On serverless, avoid statically prerendering DB-backed pages or ensure the
  database is reachable at build time (public pages use a 60s revalidation).
