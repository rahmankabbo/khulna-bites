import Link from "next/link";
import { db } from "@/lib/db";
import { startOfToday, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [newsCount, liveOffers, upcomingEvents, bookingCount, inquiries, recentBookings, recentInquiries] =
    await Promise.all([
      db.newsArticle.count(),
      db.offer.count({ where: { active: true, expiryDate: { gte: startOfToday() } } }),
      db.event.count({ where: { published: true, date: { gte: startOfToday() } } }),
      db.booking.count(),
      db.businessInquiry.count({ where: { status: "NEW" } }),
      db.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { event: { select: { title: true, slug: true } } },
      }),
      db.businessInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const stats = [
    { label: "News articles", value: newsCount, href: "/admin/news" },
    { label: "Live offers", value: liveOffers, href: "/admin/offers" },
    { label: "Upcoming events", value: upcomingEvents, href: "/admin/events" },
    { label: "Total bookings", value: bookingCount, href: "/admin/events" },
    { label: "New inquiries", value: inquiries, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Overview</h1>
          <p className="mt-1 text-sm text-mute">What&apos;s happening on Khulna Bites right now.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/news/new" className="btn-outline !px-4 !py-2 !text-xs">+ News</Link>
          <Link href="/admin/offers/new" className="btn-outline !px-4 !py-2 !text-xs">+ Offer</Link>
          <Link href="/admin/events/new" className="btn-primary !px-4 !py-2 !text-xs">+ Event</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5">
            <p className="font-display text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-mute">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Latest bookings</h2>
            <Link href="/admin/events" className="text-xs font-semibold text-sundari">All events →</Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="mt-4 text-sm text-mute">No bookings yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {recentBookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{b.name} · {b.tickets} ticket{b.tickets > 1 ? "s" : ""}</p>
                    <p className="truncate text-xs text-mute">{b.event.title}</p>
                  </div>
                  <div className="text-right">
                    <span className={b.status === "CONFIRMED" ? "badge-green" : b.status === "CANCELLED" ? "badge-red" : "badge-amber"}>
                      {b.status.toLowerCase()}
                    </span>
                    <p className="mt-1 text-[11px] text-mute">{formatDateTime(b.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Latest inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs font-semibold text-sundari">All inquiries →</Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="mt-4 text-sm text-mute">No business inquiries yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {recentInquiries.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{i.businessName}</p>
                    <p className="truncate text-xs text-mute">{i.service} — {i.name}</p>
                  </div>
                  <span className={i.status === "NEW" ? "badge-amber" : i.status === "CONTACTED" ? "badge-green" : "badge-gray"}>
                    {i.status.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
