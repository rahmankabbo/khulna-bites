import Link from "next/link";
import { db } from "@/lib/db";
import { isOfferLive, startOfToday } from "@/lib/utils";
import { NewsCard } from "@/components/news-card";
import { OfferCard } from "@/components/offer-card";
import { EventCard } from "@/components/event-card";
import { SectionHeader } from "@/components/section-header";

export const revalidate = 60; // refresh public data at most once a minute

export default async function HomePage() {
  const [news, offers, events] = await Promise.all([
    db.newsArticle.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 7,
    }),
    db.offer.findMany({
      where: { active: true, expiryDate: { gte: startOfToday() } },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.event.findMany({
      where: { published: true, date: { gte: startOfToday() } },
      orderBy: { date: "asc" },
      take: 3,
    }),
  ]);

  const lead = news[0];
  const secondary = news.slice(1, 5);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="container-site grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="kb-rise">
            <p className="eyebrow">Khulna, Bangladesh — {today}</p>
            <h1 className="headline-display mt-4 text-balance text-5xl sm:text-6xl lg:text-7xl">
              Khulna, one <span className="text-sundari">bite</span> at a time.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute">
              News, offers and events from across the city — curated daily, so you
              always know what&apos;s happening near you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/news" className="btn-primary">Explore News</Link>
              <Link href="/offers" className="btn-outline">View Offers</Link>
              <Link href="/events" className="btn-ghost">Upcoming Events →</Link>
            </div>
            <dl className="mt-12 flex gap-10 border-t border-line pt-6">
              <div>
                <dt className="text-xs uppercase tracking-wider text-mute">Live offers</dt>
                <dd className="font-display text-3xl font-bold text-ink">{offers.length}+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-mute">Upcoming events</dt>
                <dd className="font-display text-3xl font-bold text-ink">{events.length}+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-mute">Stories published</dt>
                <dd className="font-display text-3xl font-bold text-ink">{news.length}+</dd>
              </div>
            </dl>
          </div>

          {lead && (
            <div className="kb-rise lg:pl-4" style={{ animationDelay: "120ms" }}>
              <NewsCard article={lead} variant="large" />
            </div>
          )}
        </div>
      </section>

      {/* ─── Latest + trending news ───────────────────────────────────────── */}
      <section className="container-site py-16 sm:py-20">
        <SectionHeader
          eyebrow="News"
          title="Latest from the city"
          href="/news"
          hrefLabel="All news"
        />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            {secondary.slice(0, 4).map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
          <aside className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <h3 className="eyebrow">Trending now</h3>
            <ol className="mt-4">
              {news.slice(0, 5).map((a, i) => (
                <li key={a.id} className="flex gap-4 border-b border-line py-4 last:border-0">
                  <span className="font-display text-2xl font-bold text-sundari/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={`/news/${a.slug}`}
                    className="text-sm font-medium leading-snug text-ink hover:text-sundari-dark"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* ─── Offers ───────────────────────────────────────────────────────── */}
      <section className="border-y border-line bg-white">
        <div className="container-site py-16 sm:py-20">
          <SectionHeader
            eyebrow="Offers"
            title="Deals around Khulna right now"
            href="/offers"
            hrefLabel="All offers"
          />
          {offers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-line p-10 text-center text-mute">
              No live offers at the moment — check back soon.
            </p>
          )}
        </div>
      </section>

      {/* ─── Events ───────────────────────────────────────────────────────── */}
      <section className="container-site py-16 sm:py-20">
        <SectionHeader
          eyebrow="Events"
          title="Coming up in Khulna"
          href="/events"
          hrefLabel="All events"
        />
        {events.length > 0 ? (
          <div className="grid gap-4">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-mute">
            No upcoming events yet — organizers can list one via Business With Us.
          </p>
        )}
      </section>

      {/* ─── Business CTA ─────────────────────────────────────────────────── */}
      <section className="container-site pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-sundari-dark px-8 py-14 text-paper sm:px-14">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sundari opacity-60"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -right-8 h-72 w-72 rounded-full bg-amber opacity-20"
          />
          <div className="relative max-w-2xl">
            <p className="eyebrow !text-amber">Business With Us</p>
            <h2 className="headline-display mt-3 text-3xl text-balance sm:text-5xl">
              Put your business in front of Khulna.
            </h2>
            <p className="mt-4 leading-relaxed text-paper/80">
              Advertising, sponsored stories and event promotion — reach the
              people who actually live here, through a platform they read every day.
            </p>
            <Link href="/business" className="btn mt-8 bg-paper text-ink hover:bg-white">
              Work With Us →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
