"use client";

import { useActionState } from "react";
import { createInquiry, type FormState } from "@/app/actions";

const initial: FormState = { ok: false };

const SERVICES = ["Advertising", "Sponsored Content", "Event Promotion", "Business Collaboration"];

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function InquiryForm() {
  const [state, action, pending] = useActionState(createInquiry, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-sundari/30 bg-sundari-tint p-8 text-center">
        <p className="font-display text-xl font-semibold text-sundari-dark">Message received!</p>
        <p className="mt-2 text-sm text-sundari-dark/80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-name" className="label">Your name</label>
          <input id="inq-name" name="name" required className="input" placeholder="Full name" />
          <FieldError errors={state.errors?.name} />
        </div>
        <div>
          <label htmlFor="inq-biz" className="label">Business name</label>
          <input id="inq-biz" name="businessName" required className="input" placeholder="Your business" />
          <FieldError errors={state.errors?.businessName} />
        </div>
        <div>
          <label htmlFor="inq-phone" className="label">Phone</label>
          <input id="inq-phone" name="phone" required inputMode="tel" className="input" placeholder="01XXXXXXXXX" />
          <FieldError errors={state.errors?.phone} />
        </div>
        <div>
          <label htmlFor="inq-email" className="label">Email <span className="font-normal text-mute">(optional)</span></label>
          <input id="inq-email" name="email" type="email" className="input" placeholder="you@business.com" />
          <FieldError errors={state.errors?.email} />
        </div>
      </div>
      <div>
        <label htmlFor="inq-service" className="label">I&apos;m interested in</label>
        <select id="inq-service" name="service" required className="input" defaultValue="">
          <option value="" disabled>Choose a service…</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <FieldError errors={state.errors?.service} />
      </div>
      <div>
        <label htmlFor="inq-message" className="label">Message</label>
        <textarea id="inq-message" name="message" required rows={4} className="input resize-none" placeholder="Tell us what you'd like to promote, and when…" />
        <FieldError errors={state.errors?.message} />
      </div>
      {state.message && !state.ok && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto">
        {pending ? "Sending…" : "Send Inquiry →"}
      </button>
    </form>
  );
}
