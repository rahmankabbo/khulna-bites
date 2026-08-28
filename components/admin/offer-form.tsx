"use client";

import { useActionState } from "react";
import type { Offer, Category } from "@prisma/client";
import { saveOffer, type AdminFormState } from "@/app/admin/actions";
import { FieldError, CoverImageField, CheckRow } from "./form-ui";

const initial: AdminFormState = { ok: false };

const toDateInput = (d?: Date) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export function OfferForm({ offer, categories }: { offer?: Offer; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveOffer, initial);

  return (
    <form action={action} className="space-y-5">
      {offer && <input type="hidden" name="id" value={offer.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="label">Offer title</label>
          <input id="title" name="title" required defaultValue={offer?.title} className="input" placeholder="Flat 20% off lunch…" />
          <FieldError errors={state.errors?.title} />
        </div>
        <div>
          <label htmlFor="businessName" className="label">Business name</label>
          <input id="businessName" name="businessName" required defaultValue={offer?.businessName} className="input" />
          <FieldError errors={state.errors?.businessName} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="value" className="label">Offer value</label>
          <input id="value" name="value" required defaultValue={offer?.value} className="input" placeholder="20% OFF / ৳500 / BOGO" />
          <FieldError errors={state.errors?.value} />
        </div>
        <div>
          <label htmlFor="categoryId" className="label">Category</label>
          <select id="categoryId" name="categoryId" defaultValue={offer?.categoryId ?? ""} className="input">
            <option value="">Other</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="label">Location</label>
          <input id="location" name="location" required defaultValue={offer?.location} className="input" placeholder="Boyra, Khulna" />
          <FieldError errors={state.errors?.location} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="label">Description</label>
        <textarea id="description" name="description" required rows={3} defaultValue={offer?.description} className="input resize-none" />
        <FieldError errors={state.errors?.description} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="label">Start date</label>
          <input id="startDate" name="startDate" type="date" required defaultValue={toDateInput(offer?.startDate)} className="input" />
          <FieldError errors={state.errors?.startDate} />
        </div>
        <div>
          <label htmlFor="expiryDate" className="label">Expiry date</label>
          <input id="expiryDate" name="expiryDate" type="date" required defaultValue={toDateInput(offer?.expiryDate)} className="input" />
          <p className="mt-1 text-xs text-mute">Expired offers disappear from the public site automatically.</p>
          <FieldError errors={state.errors?.expiryDate} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact" className="label">Contact <span className="font-normal text-mute">(optional)</span></label>
          <input id="contact" name="contact" defaultValue={offer?.contact ?? ""} className="input" placeholder="Phone / WhatsApp" />
        </div>
        <div>
          <label htmlFor="externalUrl" className="label">External link <span className="font-normal text-mute">(optional)</span></label>
          <input id="externalUrl" name="externalUrl" type="url" defaultValue={offer?.externalUrl ?? ""} className="input" placeholder="https://…" />
          <FieldError errors={state.errors?.externalUrl} />
        </div>
      </div>

      <div>
        <label htmlFor="terms" className="label">Terms &amp; conditions <span className="font-normal text-mute">(optional)</span></label>
        <textarea id="terms" name="terms" rows={2} defaultValue={offer?.terms ?? ""} className="input resize-none" />
      </div>

      <CoverImageField existing={offer?.coverImage} error={state.errors?.coverImage} />

      <CheckRow name="active" label="Active" hint="Live on the public offers page (until expiry)" defaultChecked={offer?.active ?? true} />

      {state.message && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.message}</p>
      )}

      <div className="flex gap-3 border-t border-line pt-5">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : offer ? "Save changes" : "Publish offer"}
        </button>
        <a href="/admin/offers" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
