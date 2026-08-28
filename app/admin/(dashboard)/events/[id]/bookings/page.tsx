import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { updateBookingStatus, deleteBooking } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/row-actions";
import { BookingStatusButtons } from "@/components/admin/booking-status";

export const dynamic = "force-dynamic";

export default async function EventBookingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await db.event.findUnique({
    where: { id },
    include: { bookings: { orderBy: { createdAt: "desc" } } },
  });
  if (!event) notFound();

  const totalTickets = event.bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.tickets, 0);

  return (
    <div>
      <Link href="/admin/events" className="text-xs font-semibold text-mute hover:text-ink">← All events</Link>
      <h1 className="mt-2 font-display text-2xl font-bold">{event.title}</h1>
      <p className="mt-1 text-sm text-mute">
        {event.bookings.length} booking{event.bookings.length === 1 ? "" : "s"} · {totalTickets} tickets
        {event.capacity ? ` · capacity ${event.capacity}` : ""}
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-line">
            <tr>
              <th className="th">Name</th>
              <th className="th">Contact</th>
              <th className="th">Tickets</th>
              <th className="th">Status</th>
              <th className="th">Booked</th>
              <th className="th"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {event.bookings.map((b) => (
              <tr key={b.id} className="hover:bg-paper/60">
                <td className="td font-medium">{b.name}</td>
                <td className="td">
                  <p>{b.phone}</p>
                  {b.email && <p className="text-xs text-mute">{b.email}</p>}
                </td>
                <td className="td">{b.tickets}</td>
                <td className="td">
                  <BookingStatusButtons
                    current={b.status}
                    onSelect={updateBookingStatus.bind(null, b.id)}
                  />
                </td>
                <td className="td whitespace-nowrap text-mute">{formatDateTime(b.createdAt)}</td>
                <td className="td text-right">
                  <DeleteButton action={deleteBooking.bind(null, b.id, event.id)} confirmText={`Delete booking for ${b.name}?`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {event.bookings.length === 0 && (
          <p className="p-10 text-center text-sm text-mute">No bookings for this event yet.</p>
        )}
      </div>
    </div>
  );
}
