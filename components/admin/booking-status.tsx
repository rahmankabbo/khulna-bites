"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"] as const;

export function BookingStatusButtons({
  current,
  onSelect,
}: {
  current: (typeof STATUSES)[number];
  onSelect: (status: (typeof STATUSES)[number]) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className={cn("flex gap-1", pending && "opacity-50")}>
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          disabled={pending || s === current}
          onClick={() =>
            startTransition(async () => {
              await onSelect(s);
              router.refresh();
            })
          }
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
            s === current
              ? s === "CONFIRMED"
                ? "bg-sundari-tint text-sundari-dark"
                : s === "CANCELLED"
                  ? "bg-red-50 text-red-700"
                  : "bg-amber-tint text-amber"
              : "bg-ink/5 text-mute hover:bg-ink/10"
          )}
        >
          {s.toLowerCase()}
        </button>
      ))}
    </div>
  );
}
