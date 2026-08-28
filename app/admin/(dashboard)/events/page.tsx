import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { deleteEvent, toggleEventFlag } from "@/app/admin/actions";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await db.event.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Events</h1>
          <p className="mt-1 text-sm text-mute">{events.length} event{events.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/admin/events/new" className="btn-primary !px-5 !py-2.5">+ New event</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[780px]">
          <thead className="border-b border-line">
            <tr>
              <th className="th">Event</th>
              <th className="th">Date</th>
              <th className="th">Bookings</th>
              <th className="th">Published</th>
              <th className="th">Booking</th>
              <th className="th"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-paper/60">
                <td className="td max-w-[280px]">
                  <p className="truncate font-medium">{e.title}</p>
                  <p className="truncate text-xs text-mute">{e.venue}</p>
                </td>
                <td className="td whitespace-nowrap text-mute">{formatDate(e.date)}</td>
                <td className="td">
                  <Link href={`/admin/events/${e.id}/bookings`} className="font-semibold text-sundari hover:underline">
                    {e._count.bookings} →
                  </Link>
                </td>
                <td className="td">
                  <ToggleButton action={toggleEventFlag.bind(null, e.id, "published")} on={e.published} onLabel="Live" offLabel="Draft" />
                </td>
                <td className="td">
                  <ToggleButton action={toggleEventFlag.bind(null, e.id, "bookingEnabled")} on={e.bookingEnabled} onLabel="Open" offLabel="Closed" />
                </td>
                <td className="td">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/events/${e.id}/edit`} className="text-xs font-semibold text-sundari hover:underline">Edit</Link>
                    <DeleteButton action={deleteEvent.bind(null, e.id)} confirmText={`Delete “${e.title}” and all its bookings?`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="p-10 text-center text-sm text-mute">No events yet — create the first one.</p>
        )}
      </div>
    </div>
  );
}
