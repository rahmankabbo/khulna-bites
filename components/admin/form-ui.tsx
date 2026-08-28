"use client";

import Image from "next/image";
import { useState } from "react";

/** Shared bits for the admin editor forms. */

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function CoverImageField({
  existing,
  error,
}: {
  existing?: string;
  error?: string[];
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const shown = preview ?? existing;

  return (
    <div>
      <label htmlFor="coverImage" className="label">Cover image</label>
      {shown && (
        <div className="relative mb-3 aspect-[16/8] w-full max-w-sm overflow-hidden rounded-xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shown} alt="Cover preview" className="h-full w-full object-cover" />
        </div>
      )}
      <input type="hidden" name="existingImage" value={existing ?? ""} />
      <input
        id="coverImage"
        name="coverImage"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="block w-full max-w-sm text-sm text-mute file:mr-3 file:rounded-full file:border-0 file:bg-sundari-tint file:px-4 file:py-2 file:text-xs file:font-semibold file:text-sundari-dark hover:file:bg-sundari/20"
        onChange={(e) => {
          const f = e.target.files?.[0];
          setPreview(f ? URL.createObjectURL(f) : null);
        }}
      />
      <p className="mt-1 text-xs text-mute">JPG, PNG, WebP or AVIF, max 4 MB.</p>
      <FieldError errors={error} />
    </div>
  );
}

export function CheckRow({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white px-4 py-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-sundari" />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-mute">{hint}</span>}
      </span>
    </label>
  );
}
