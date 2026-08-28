"use client";

import { useActionState } from "react";
import type { Event } from "@prisma/client";
import { saveEvent, type AdminFormState } from "@/app/admin/actions";
import { FieldError, CoverImageField, CheckRow } from "./form-ui";

const initial: AdminFormState = { ok: false };

const toDateInput = (d?: Date) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export function EventForm({ event }: { event?: Event }) {
  const [state, action, pending] = useActionState(saveEvent, initial);

  return (
    <form action={action} className="space-y-5">
      {event && <input type="hidden" name="id" value={event.id} />}

      <div>
        <label htmlFor="title" className="label">Event name</label>
        <input id="title" name="title" required defaultValue={event?.title} className="input" placeholder="Khulna Food Fest 2026" />
        <FieldError errors={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="description" className="label">Description</label>
        <textarea id="description" name="description" required rows={5} defaultValue={event?.description} className="input resize-y" />
        <FieldError errors={state.errors?.description} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="date" className="label">Date</label>
          <input id="date" name="date" type="date" required defaultValue={toDateInput(event?.date)} className="input" />
          <FieldError errors={state.errors?.date} />
        </div>
        <div>
          <label htmlFor="startTime" className="label">Start time</label>
          <input id="startTime" name="startTime" type="time" required defaultValue={event?.startTime} className="input" />
          <FieldError errors={state.errors?.startTime} />
        </div>
        <div>
          <label htmlFor="endTime" className="label">End time <span className="font-normal text-mute">(optional)</span></label>
          <input id="endTime" name="endTime" type="time" defaultValue={event?.endTime ?? ""} className="input" />
          <FieldError errors={state.errors?.endTime} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="venue" className="label">Venue</label>
          <input id="venue" name="venue" required defaultValue={event?.venue} className="input" placeholder="Khulna Zila School Field" />
          <FieldError errors={state.errors?.venue} />
        </div>
        <div>
          <label htmlFor="location" className="label">Location <span className="font-normal text-mute">(optional)</span></label>
          <input id="location" name="location" defaultValue={event?.location ?? ""} className="input" placeholder="KDA Avenue, Khulna" />
        </div>
        <div>
          <label htmlFor="organizer" className="label">Organizer <span className="font-normal text-mute">(optional)</span></label>
          <input id="organizer" name="organizer" defaultValue={event?.organizer ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="ticketPrice" className="label">Ticket price <span className="font-normal text-mute">(optional)</span></label>
          <input id="ticketPrice" name="ticketPrice" defaultValue={event?.ticketPrice ?? ""} className="input" placeholder="৳300 / Free" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bookingUrl" className="label">External booking URL <span className="font-normal text-mute">(optional)</span></label>
          <input id="bookingUrl" name="bookingUrl" type="url" defaultValue={event?.bookingUrl ?? ""} className="input" placeholder="https://…" />
          <p className="mt-1 text-xs text-mute">If set, “Book Now” links here instead of the built-in form.</p>
          <FieldError errors={state.errors?.bookingUrl} />
        </div>
        <div>
          <label htmlFor="capacity" className="label">Total capacity <span className="font-normal text-mute">(optional)</span></label>
          <input id="capacity" name="capacity" type="number" min={1} defaultValue={event?.capacity ?? ""} className="input" placeholder="e.g. 300" />
          <FieldError errors={state.errors?.capacity} />
        </div>
      </div>

      <CoverImageField existing={event?.coverImage} error={state.errors?.coverImage} />

      <div className="grid gap-3 sm:grid-cols-2">
        <CheckRow name="published" label="Published" hint="Visible on the public events page" defaultChecked={event?.published ?? true} />
        <CheckRow name="bookingEnabled" label="Booking open" hint="Visitors can book a spot" defaultChecked={event?.bookingEnabled ?? true} />
      </div>

      {state.message && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.message}</p>
      )}

      <div className="flex gap-3 border-t border-line pt-5">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : event ? "Save changes" : "Publish event"}
        </button>
        <a href="/admin/events" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
