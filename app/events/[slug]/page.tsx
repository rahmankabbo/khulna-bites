import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { BookingForm } from "@/components/booking-form";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug } });
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: { images: [event.coverImage] },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await db.event.findFirst({
    where: { slug, published: true },
    include: {
      bookings: { where: { status: { not: "CANCELLED" } }, select: { tickets: true } },
    },
  });
  if (!event) notFound();

  const booked = event.bookings.reduce((sum, b) => sum + b.tickets, 0);
  const remaining = event.capacity ? Math.max(0, event.capacity - booked) : null;
  const soldOut = remaining !== null && remaining <= 0;
  const past = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="container-site py-12 sm:py-16">
      <nav className="text-xs text-mute" aria-label="Breadcrumb">
        <Link href="/events" className="hover:text-ink">Events</Link>
        <span aria-hidden> / </span>
        <span className="text-ink">{event.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line">
            <Image src={event.coverImage} alt={event.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 60vw" />
          </div>

          <h1 className="headline-display mt-8 text-balance text-4xl sm:text-5xl">{event.title}</h1>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Date", value: formatDate(event.date) },
              { label: "Time", value: `${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}` },
              { label: "Venue", value: event.venue },
              { label: "Tickets", value: event.ticketPrice ?? "See details" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-line bg-white p-4">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-mute">{item.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="prose-kb mt-8">
            {event.description.split("\n").filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 space-y-2 border-t border-line pt-6 text-sm text-mute">
            {event.organizer && (
              <p><span className="font-semibold text-ink">Organizer:</span> {event.organizer}</p>
            )}
            {event.location && (
              <p><span className="font-semibold text-ink">Location:</span> {event.location}</p>
            )}
          </div>
        </div>

        {/* Booking panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Book your spot</h2>
              {remaining !== null && !soldOut && (
                <span className="badge-amber">{remaining} left</span>
              )}
            </div>

            <div className="mt-6">
              {past ? (
                <p className="rounded-xl bg-ink/5 px-4 py-3 text-sm text-mute">This event has already taken place.</p>
              ) : !event.bookingEnabled ? (
                <p className="rounded-xl bg-ink/5 px-4 py-3 text-sm text-mute">
                  No advance booking needed — just show up at the venue.
                </p>
              ) : soldOut ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">This event is fully booked.</p>
              ) : event.bookingUrl ? (
                <>
                  <p className="text-sm text-mute">Tickets are handled by the organizer&apos;s booking page.</p>
                  <a href={event.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 w-full">
                    Book Now →
                  </a>
                </>
              ) : (
                <BookingForm eventId={event.id} eventTitle={event.title} />
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
