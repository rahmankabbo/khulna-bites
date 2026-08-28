"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

/** Small client helpers for table rows: delete with confirm + toggle buttons. */

export function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Delete this item? This cannot be undone.",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) {
          startTransition(async () => {
            await action();
            router.refresh();
          });
        }
      }}
      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Working…" : label}
    </button>
  );
}

export function ToggleButton({
  action,
  on,
  onLabel,
  offLabel,
}: {
  action: () => Promise<void>;
  on: boolean;
  onLabel: string;
  offLabel: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await action();
          router.refresh();
        })
      }
      className={
        on
          ? "badge-green hover:opacity-80 disabled:opacity-50"
          : "badge-gray hover:opacity-80 disabled:opacity-50"
      }
      title={on ? `Click to ${offLabel.toLowerCase()}` : `Click to ${onLabel.toLowerCase()}`}
    >
      {pending ? "…" : on ? onLabel : offLabel}
    </button>
  );
}
