import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/lib/types";

type Props = { event: Event };

export function EventCard({ event }: Props) {
  const d = new Date(event.date);
  const day = d.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();

  return (
    <Link href={`/events/${event.slug}`} className="card group flex overflow-hidden">
      {/* Strong date block — the signature of the events system */}
      <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 border-r border-line bg-sundari-tint py-6">
        <span className="font-display text-3xl font-bold leading-none text-sundari-dark">{day}</span>
        <span className="text-xs font-bold tracking-[0.2em] text-sundari">{month}</span>
      </div>
      <div className="relative hidden w-40 shrink-0 sm:block">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="160px"
        />
      </div>
      <div className="min-w-0 flex-1 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-sundari-dark">
          {event.title}
        </h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mute">
          <span>{event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}</span>
          <span aria-hidden>·</span>
          <span>{event.venue}</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {event.ticketPrice && <span className="chip">{event.ticketPrice}</span>}
          {event.bookingEnabled ? (
            <span className="badge-green">Booking open</span>
          ) : (
            <span className="badge-gray">No booking needed</span>
          )}
        </div>
      </div>
    </Link>
  );
}
