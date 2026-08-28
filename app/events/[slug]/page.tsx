import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug, getAllEventSlugs } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: { images: [event.coverImage] },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

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
              <h2 className="font-display text-xl font-bold">Event &amp; Tickets</h2>
              {event.ticketPrice && (
                <span className="badge-amber">{event.ticketPrice}</span>
              )}
            </div>

            <div className="mt-6">
              {past ? (
                <p className="rounded-xl bg-ink/5 px-4 py-3 text-sm text-mute">
                  This event has already taken place.
                </p>
              ) : !event.bookingEnabled ? (
                <div className="rounded-2xl bg-ink/5 p-5 text-sm">
                  <p className="font-semibold text-ink">Free Entry / Walk-in Event</p>
                  <p className="mt-2 text-mute">
                    No advance ticket or registration is required. Arrive directly at {event.venue} on {formatDate(event.date)}.
                  </p>
                </div>
              ) : event.bookingUrl ? (
                <div>
                  <p className="text-sm leading-relaxed text-mute">
                    Official passes and registration are handled by the organizer.
                  </p>
                  <a
                    href={event.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-4 w-full justify-center"
                  >
                    Book on Organizer&apos;s Page →
                  </a>
                  <p className="mt-3 text-center text-xs text-mute">
                    Opens external registration portal
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-line bg-ink/[0.02] p-5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="badge-green">Booking open soon</span>
                  </div>
                  <p className="mt-3 font-medium text-ink">
                    Online booking information coming soon
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-mute">
                    Advance registration details will be published by the organizer ({event.organizer ?? "Khulna Bites"}).
                    For immediate inquiries or group entry, visit the venue or contact the organizer desk.
                  </p>
                  <div className="mt-5 border-t border-line pt-4">
                    <p className="text-xs text-mute">
                      Venue: <span className="font-medium text-ink">{event.venue}</span>
                    </p>
                    <p className="mt-1 text-xs text-mute">
                      Date &amp; Time: <span className="font-medium text-ink">{formatDate(event.date)} at {event.startTime}</span>
                    </p>
                  </div>
                  <Link
                    href="/business"
                    className="btn-outline mt-5 w-full justify-center !text-xs"
                  >
                    Contact Organizer / Event Desk →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
