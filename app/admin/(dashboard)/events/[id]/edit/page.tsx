import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EventForm } from "@/components/admin/event-form";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Edit event</h1>
      <p className="mt-1 truncate text-sm text-mute">{event.title}</p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
        <EventForm event={event} />
      </div>
    </div>
  );
}
