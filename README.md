# Khulna Bites

**Everything happening in Khulna, in one place.**

A local media and discovery platform for Khulna, Bangladesh — news, offers,
events, and a Business With Us channel with direct contact options.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS · Static Data Layer · PostgreSQL & Prisma (Local Admin)**.

---

## Deploying the Public Website to Vercel

The public-facing Khulna Bites website is fully decoupled and optimized for zero-configuration, lightning-fast deployment on **Vercel** with **no PostgreSQL or cloud database required**.

### Why PostgreSQL is NOT required for Vercel deployment

1. **Decoupled Public Data Layer**: All public pages (`/`, `/news`, `/news/[slug]`, `/offers`, `/offers/[slug]`, `/events`, `/events/[slug]`, `/business`) read from `lib/demo-data.ts`.
2. **Evergreen Relative Dates**: News, offers, and events calculate dynamic relative dates so that active deals, upcoming events, and fresh stories stay live and relevant without database maintenance.
3. **Static Site Generation (SSG)**: All dynamic detail routes use `generateStaticParams()` to pre-render static HTML pages at build time.
4. **Graceful Public Actions**:
   - **Events**: Events with an external booking URL provide direct links to the organizer's ticket portal; events without external tickets display organizer venue/date details and notice that booking info is coming soon.
   - **Business With Us**: The inquiry form validates user input and immediately creates an email mailto draft and on-screen confirmation, allowing prospective sponsors/advertisers to reach the desk directly without an online database.

### What remains Local-Only

The following features remain available for local development and future database/admin expansion:
- `/admin/login` and the protected `/admin` dashboard
- Prisma schema, migrations, seed script (`npm run db:seed`), and Prisma Studio (`npm run db:studio`)
- Full administrative CRUD operations for news, offers, events, bookings, and inquiry inbox
- Local PostgreSQL instance

### How to deploy from GitHub to Vercel

1. **Push your repository to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy public website to Vercel"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository (`khulna-bites`).
   - Framework Preset: **Next.js** (auto-detected).
   - Root Directory: `./` (or the folder containing `package.json`).

3. **Environment Variables**:
   - **Zero required environment variables!**
   - (Optional) `NEXT_PUBLIC_SITE_URL`: Your custom domain (e.g. `https://khulnabites.com` or `https://khulna-bites.vercel.app`).

4. **Click "Deploy"**:
   - Vercel runs `npm run build` and deploys your public website live in under 1 minute.

---

## Local Development (Next.js + Prisma + PostgreSQL + Admin Dashboard)

For full local development with the admin dashboard and database features:

### 1. Install dependencies

```bash
npm install
```

### 2. Configure `.env` file

```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
DATABASE_URL="postgresql://khulna:khulna_dev_password@localhost:5432/khulna_bites"
AUTH_SECRET="your-32-char-random-secret"
ADMIN_SEED_EMAIL="admin@khulnabites.com"
ADMIN_SEED_PASSWORD="khulna123"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Start PostgreSQL

#### Option A — Docker Compose
```bash
docker compose up -d
```

#### Option B — Local PostgreSQL Server
Create the local user and database:
```sql
CREATE USER khulna WITH PASSWORD 'khulna_dev_password';
CREATE DATABASE khulna_bites OWNER khulna;
```

### 4. Run Migrations & Seed Local Database

```bash
npm run db:push
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard (Login: `admin@khulnabites.com` / `khulna123`).

### 6. Build and Test Locally

```bash
npm run build
npm run start
```

---

## Project Architecture

```
khulna-bites/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home (hero, news, offers, events, CTA)
│   ├── news/                   # News list & [slug] article pages
│   ├── offers/                 # Offers list & [slug] deal pages
│   ├── events/                 # Events list & [slug] event pages
│   ├── business/               # Business With Us & inquiry form
│   ├── actions.ts              # Public server actions (safe fallback)
│   └── admin/                  # [Local-Only] Protected admin dashboard & CRUD
├── components/                 # Reusable UI components
│   ├── news-card.tsx           # News story cards & rows
│   ├── offer-card.tsx          # Discount offer cards
│   ├── event-card.tsx          # Event date-badge cards
│   ├── inquiry-form.tsx        # Client inquiry form
│   ├── site-header.tsx         # Responsive navigation & mobile drawer
│   └── site-footer.tsx         # Footer links & copyright
├── lib/
│   ├── types.ts                # TypeScript data interfaces
│   ├── demo-data.ts            # Public static/demo repository & query helpers
│   ├── db.ts                   # Prisma client singleton (Local-only)
│   ├── auth.ts                 # JWT session & admin authentication (Local-only)
│   └── utils.ts                # Date formatting, slugify, classnames
├── prisma/
│   ├── schema.prisma           # Prisma models & relations
│   └── seed.ts                 # Local database seed script
└── public/
    └── images/                 # Optimized local assets & demo images
```

---

## Security Notes

- No database credentials, API keys, or JWT secrets are hardcoded in public code.
- `.env` and `.env*.local` are strictly `.gitignore`d.
- Admin routes are protected with JWT cookies and force-dynamic server-side validation.
