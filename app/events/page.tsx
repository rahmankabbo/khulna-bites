import type { Metadata } from "next";
import { db } from "@/lib/db";
import { startOfToday } from "@/lib/utils";
import { EventCard } from "@/components/event-card";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events in Khulna — festivals, concerts, meetups, walks and sports. Book your spot.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    db.event.findMany({
      where: { published: true, date: { gte: startOfToday() } },
      orderBy: { date: "asc" },
    }),
    db.event.findMany({
      where: { published: true, date: { lt: startOfToday() } },
      orderBy: { date: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div className="container-site py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">Events</p>
        <h1 className="headline-display mt-2 text-4xl sm:text-5xl">What&apos;s on in Khulna</h1>
        <p className="mt-4 text-mute">
          Festivals, concerts, meetups and walks — book your spot directly or through the organizer.
        </p>
      </header>

      <div className="mt-10 grid gap-4">
        {upcoming.length > 0 ? (
          upcoming.map((e) => <EventCard key={e.id} event={e} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-line p-14 text-center">
            <p className="font-display text-xl font-semibold">No upcoming events right now</p>
            <p className="mt-2 text-sm text-mute">
              Organizing something? <a href="/business" className="font-semibold text-sundari">Promote it with us →</a>
            </p>
          </div>
        )}
      </div>

      {past.length > 0 && (
        <section className="mt-16">
          <h2 className="eyebrow mb-6">Recently past</h2>
          <div className="grid gap-4 opacity-60">
            {past.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
