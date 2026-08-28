import { EventForm } from "@/components/admin/event-form";

export const dynamic = "force-dynamic";

export default function NewEventPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">New event</h1>
      <p className="mt-1 text-sm text-mute">Published events appear on the public site immediately.</p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
        <EventForm />
      </div>
    </div>
  );
}
