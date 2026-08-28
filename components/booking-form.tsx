"use client";

import { useActionState } from "react";
import { createBooking, type FormState } from "@/app/actions";

const initial: FormState = { ok: false };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function BookingForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [state, action, pending] = useActionState(createBooking, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-sundari/30 bg-sundari-tint p-6 text-center">
        <p className="font-display text-lg font-semibold text-sundari-dark">You&apos;re on the list!</p>
        <p className="mt-1 text-sm text-sundari-dark/80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="eventId" value={eventId} />
      <div>
        <label htmlFor="bk-name" className="label">Full name</label>
        <input id="bk-name" name="name" required className="input" placeholder="Your name" />
        <FieldError errors={state.errors?.name} />
      </div>
      <div>
        <label htmlFor="bk-phone" className="label">Phone</label>
        <input id="bk-phone" name="phone" required inputMode="tel" className="input" placeholder="01XXXXXXXXX" />
        <FieldError errors={state.errors?.phone} />
      </div>
      <div>
        <label htmlFor="bk-email" className="label">Email <span className="font-normal text-mute">(optional)</span></label>
        <input id="bk-email" name="email" type="email" className="input" placeholder="you@example.com" />
        <FieldError errors={state.errors?.email} />
      </div>
      <div>
        <label htmlFor="bk-tickets" className="label">Number of tickets</label>
        <input id="bk-tickets" name="tickets" type="number" min={1} max={20} defaultValue={1} required className="input" />
        <FieldError errors={state.errors?.tickets} />
      </div>
      {state.message && !state.ok && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Booking…" : `Book Now — ${eventTitle}`}
      </button>
      <p className="text-center text-xs text-mute">
        No online payment needed — pay at the venue. The organizer confirms by phone.
      </p>
    </form>
  );
}
